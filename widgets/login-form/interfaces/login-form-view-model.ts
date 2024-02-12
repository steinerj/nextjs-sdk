import { ExternalProvider } from '../../../rest-sdk/dto/external-provider';
import { Attributes } from '../../../typings/attributes';

export interface LoginFormViewModel {
    LoginHandlerPath: string;
    RememberMe: boolean;
    MembershipProviderName?: string;
    Attributes?: Attributes;
    ExternalProviders?: ExternalProvider[];
    InvalidClass: string;
    VisibilityClasses: { [key: string]: string };
    RedirectUrl?: string;
    ForgottenPasswordLink?: string;
    RegistrationLink?: string;
    Labels: {
        EmailLabel: string,
        ErrorMessage: string,
        ExternalProvidersHeader: string,
        ForgottenPasswordLinkLabel: string,
        Header: string,
        NotRegisteredLabel: string,
        PasswordLabel: string,
        RegisterLinkText: string,
        RememberMeLabel: string,
        SubmitButtonLabel: string,
        ValidationInvalidEmailMessage: string,
        ValidationRequiredMessage: string
     };
};
