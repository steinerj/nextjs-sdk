import { SdkItem } from '../../../rest-sdk/dto/sdk-item';

export interface FormDto extends SdkItem
{
    Title: string;
    Name: string;
    Renderer: string;
    TemplateName: string;
    Rules: string;
}
