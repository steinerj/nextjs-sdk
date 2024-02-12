import { Category, Choice, ConditionalVisibility, Content, ContentSection, DataModel, DataType, DefaultValue, Description, DisplayName, KeysValues, KnownFieldTypes, LengthDependsOn, Margins, PropertyCategory, ViewSelector, WidgetEntity, WidgetLabel } from '@progress/sitefinity-widget-designers-sdk';
import { MixedContentContext } from '../../editor/widget-framework/mixed-content-context';
import { OffsetStyle } from '../styling/offset-style';
import { PostRegistrationAction } from './interfaces/post-registration-action';
import { RestSdkTypes } from '../../rest-sdk/rest-client';

@WidgetEntity('SitefinityRegistration', 'Registration')
export class RegistrationEntity {
    @DisplayName('If form is submitted successfully, users will...')
    @ContentSection('Select pages', 1)
    @DataType(KnownFieldTypes.RadioChoice)
    @Choice([
        { Title: 'View a message', Value: PostRegistrationAction.ViewMessage },
        { Title: 'Redirect to page...', Value: PostRegistrationAction.RedirectToPage }
    ])
    PostRegistrationAction: PostRegistrationAction = PostRegistrationAction.ViewMessage;

    @Content({
        Type: RestSdkTypes.Pages,
        AllowMultipleItemsSelection: false
    })
    @DisplayName('')
    @ContentSection('Select pages', 1)
    @ConditionalVisibility('{\u0022conditions\u0022:[{\u0022fieldName\u0022:\u0022PostRegistrationAction\u0022,\u0022operator\u0022:\u0022Equals\u0022,\u0022value\u0022:\u0022RedirectToPage\u0022}],\u0022inline\u0022:\u0022true\u0022}')
    @DefaultValue(null)
    PostRegistrationRedirectPage?: MixedContentContext;

    @Content({
        Type: RestSdkTypes.Pages,
        AllowMultipleItemsSelection: false
    })
    @DisplayName('Login page')
    @ContentSection('Select pages', 1)
    @Description('This is the page where you have dropped the Login form widget. If you leave this field empty, a link to the Login page will not be displayed in the Registration widget.')
    @DefaultValue(null)
    LoginPage?: MixedContentContext;

    @ContentSection('Register with external providers', 1)
    @DisplayName('Allow users to log in with...')
    @DataType(KnownFieldTypes.MultipleChoiceChip)
    @Choice({
        ActionTitle: 'Select external providers',
        NotResponsive: false,
        ButtonTitle: 'Add',
        ServiceUrl: '/Default.GetExternalProviders()'
    })
    ExternalProviders?: string[];

    @ContentSection('Display settings', 1)
    @ViewSelector([{ Value: 'Default' }])
    @DisplayName('Registration template')
    SfViewName: string = 'Default';

    @ContentSection('Display settings', 1)
    @Margins('Registration')
    Margins?: OffsetStyle;

    // Advanced
    @WidgetLabel()
    SfWidgetLabel: string = 'Registration';

    @DisplayName('CSS class')
    @Category(PropertyCategory.Advanced)
    CssClass?: string;

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages')
    @DisplayName('Registration header')
    Header = 'Registration';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages')
    @DisplayName('First name field label')
    FirstNameLabel = 'First name';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages')
    @DisplayName('Last name field label')
    LastNameLabel = 'Last name';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages')
    @DisplayName('Email field label')
    EmailLabel = 'Email';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages')
    @DisplayName('Password field label')
    PasswordLabel = 'Password';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages')
    @DisplayName('Reset password field label')
    RepeatPasswordLabel = 'Repeat password';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages')
    @DisplayName('Secret question field label')
    SecretQuestionLabel = 'Secret question';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages')
    @DisplayName('Secret answer field label')
    SecretAnswerLabel = 'Secret answer';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages')
    @DisplayName('Register button')
    RegisterButtonLabel = 'Register';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages')
    @DisplayName('Activation link header')
    ActivationLinkHeader = 'Please check your email';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages')
    @DisplayName('Activation link label')
    ActivationLinkLabel = 'An activation link has been sent to';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages')
    @DisplayName('Send again link')
    SendAgainLink = 'Send again';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages')
    @DisplayName('Send again label')
    SendAgainLabel = 'Another activation link has been sent to {0}. If you have not received an email please check your spam box.';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages')
    @DisplayName('Success header')
    SuccessHeader = 'Thank you!';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages')
    @DisplayName('Success label')
    SuccessLabel = 'You are successfully registered.';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages')
    @DisplayName('Login label')
    LoginLabel = 'Already registered?';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages')
    @DisplayName('Login link')
    LoginLink = 'Log in';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages')
    @DisplayName('External providers header')
    ExternalProvidersHeader = 'or connect with...';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages')
    @DisplayName('Required fields error message')
    ValidationRequiredMessage = 'All fields are required.';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages')
    @DisplayName('Invalid email error message')
    ValidationInvalidEmailMessage = 'Invalid email format.';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages')
    @DisplayName('Password mismatch error message')
    ValidationMismatchMessage = 'Password and repeat password don\'t match.';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages')
    @DisplayName('Activation message')
    ActivationMessage = 'Your account is activated';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages')
    @DisplayName('Activation fail message')
    ActivationFailMessage = 'Your account could not be activated';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Attributes')
    @DisplayName('Attributes for...')
    @DataType(KnownFieldTypes.Attributes)
    @DataModel(KeysValues)
    @LengthDependsOn(null, '', ' ', '[{"Name": "Registration", "Title": "Registration"}]')
    Attributes?: { [key: string]: Array<{ Key: string, Value: string}> };
}
