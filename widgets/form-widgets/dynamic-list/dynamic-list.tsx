import { DropdownDefaultRender } from '../dropdown/dropdown';
import { CheckboxesDefaultRender } from '../checkboxes/checkboxes';
import { WidgetContext } from '../../../editor/widget-framework/widget-context';
import { DynamicListEntity } from './dynamic-list.entity';
import { SdkItem } from '../../../rest-sdk/dto/sdk-item';
import { SelectionMode } from './selection-modes';
import { RestClient } from '../../../rest-sdk/rest-client';
import { TaxonDto } from '../../../rest-sdk/dto/taxon-dto';
import { GetAllArgs } from '../../../rest-sdk/args/get-all.args';
import { ChoiceOption } from '../common/choice-option';
import { CheckboxesEntity } from '../checkboxes/checkboxes.entity';
import { DropdownEntity } from '../dropdown/dropdown.entity';
import { htmlAttributes, setWarning } from '../../../editor/widget-framework/attributes';

export async function DynamicList(props: WidgetContext<DynamicListEntity>) {

    const entity = props.model.Properties;
    let choices = await getChoiceItems(entity);
    let defaultRender: JSX.Element;

    if (entity.SfViewName === 'Dropdown') {
        if (choices.length > 0) {
            choices.unshift({ Name: 'Select', Value: '', Selected: true });
        }

        let dropdownEntity: DropdownEntity = {
            Choices: choices,
            CssClass: entity.CssClass,
            Hidden: entity.Hidden,
            InstructionalText: entity.InstructionalText,
            SfFieldName: entity.SfFieldName,
            SfFieldType: 'Dropdown',
            Required: entity.Required,
            RequiredErrorMessage: entity.RequiredErrorMessage || '',
            FieldSize: entity.FieldSize,
            SfViewName: 'Default',
            Label: entity.Label || '',
            Sorting: 'Manual'
        };

        defaultRender = (<DropdownDefaultRender entity={dropdownEntity} />);

    } else {
        let checkboxesEntity: CheckboxesEntity = {
            Choices: choices,
            ColumnsNumber: entity.ColumnsNumber,
            CssClass: entity.CssClass,
            HasAdditionalChoice: false,
            Hidden: entity.Hidden,
            InstructionalText: entity.InstructionalText,
            Label: entity.Label,
            SfFieldName: entity.SfFieldName,
            SfFieldType: 'Checkboxes',
            Required: entity.Required,
            RequiredErrorMessage: entity.RequiredErrorMessage as string,
            SfViewName: 'Default'
        };

        defaultRender = (<CheckboxesDefaultRender entity={checkboxesEntity} /> );
    }

    if (props.requestContext.isEdit) {
        const dataAttributes = htmlAttributes(props);

        if (entity.SelectedContent === null || entity.SelectedContent.Content === null || !entity.SelectedContent.Content[0].Type) {
            setWarning(dataAttributes, 'No list type have been selected');
        } else if (choices.length === 0) {
            setWarning(dataAttributes, 'Selected list is empty');
        }

        return (
          <div {...dataAttributes}>
            {defaultRender}
          </div>
        );
    }

    return defaultRender;
}


async function getChoiceItems(entity: DynamicListEntity): Promise<ChoiceOption[]> {
    let items: SdkItem[] = [];
    let defaultFieldName: string = 'Title';
    if (entity.ListType === SelectionMode.Classification) {
        items = await getClassifications(entity);
    } else if (entity.ListType === SelectionMode.Content) {
        items = await getContent(entity);
    }

    return transformItemsToChoices(items, defaultFieldName, entity);
}


async function getContent(entity: DynamicListEntity): Promise<SdkItem[]> {
    if (entity.SelectedContent != null &&
        entity.SelectedContent.Content != null &&
        entity.SelectedContent.Content.length > 0 &&
        entity.SelectedContent.Content[0].Type != null) {
        let itemType = entity.SelectedContent.Content[0].Type;
        const getAllArgs: GetAllArgs = {
            orderBy: [],
            type: itemType
        };


        const orderBy = getOrderByExpressionForContent(entity);
        if (orderBy !== null) {
            getAllArgs.orderBy!.push(orderBy);
        }

        let items = await RestClient.getItems(getAllArgs);
        return items.Items;
    }

    return [];
}

function getOrderByExpressionForContent(entity: DynamicListEntity) {
    if (entity.OrderByContent === 'Manually') {
        return null;
    }

    let sortExpression = entity.OrderByContent === 'Custom' ? entity.SortExpression : entity.OrderByContent;

    if (!sortExpression) {
        return null;
    }

    let sortExpressionParts = sortExpression!.split(' ');
    if (sortExpressionParts.length !== 2) {

        return null;
    }

    let sortOrder = sortExpressionParts[1].toLowerCase() === 'ASC' ? 'asc' : 'desc';
    let orderBy = { Name: sortExpressionParts[0], Type: sortOrder };

    return orderBy;
}

async function getClassifications(entity: DynamicListEntity): Promise<TaxonDto[]> {
    const settings = entity.ClassificationSettings;

    if (settings &&  settings.selectedTaxonomyId) {
        let orderBy = entity.OrderBy || 'Title ASC';

        if (orderBy === 'Custom') {
            orderBy = entity.SortExpression || '';
        } else if (orderBy === 'Manually'){
            orderBy = 'Ordinal';
        }

        return RestClient.getTaxons({
            contentType: settings.byContentType!,
            orderBy: orderBy as string,
            selectionMode: settings.selectionMode,
            taxonomyId: settings.selectedTaxonomyId,
            showEmpty: true,
            taxaIds: settings.selectedTaxaIds!
        });

    }

    return Promise.resolve([]);
}

function transformItemsToChoices(items: SdkItem[], defaultFieldName: string, entity: DynamicListEntity) : ChoiceOption[] {
    if (!items){
        return [];
    }

    const returnVal = items.map(x =>{
        const option: ChoiceOption = {
            Name: x[defaultFieldName],
            Value: entity.ValueFieldName && x[entity.ValueFieldName] ? x[entity.ValueFieldName] : x[defaultFieldName],
            Selected: false
        };


        return option;
    });

    return returnVal;
}
