import { OrgNameAutoFillModel } from './CorrespondenenceDetails.model';
export class CorrespondenceWFFormModel {
    CorrespondenceDate: string;			// CorrespondenceDate
    Confidential: string;			    // Confidential
    ConnectedID: string;				// connectedid 
    refID: string;						// refID 
    CorrespondenceID: string;			// CorrespondenceID
    CorrespondenceCode: string;			// CorrespondenceCode
    SenderDetails: OrgNameAutoFillModel;
    RecipientDetails: OrgNameAutoFillModel;
    ExternalOrganization: string;	    // ExternalOrganization
    SenderDepartment: string;			// SenderDepartment
    SenderName: string;					// SenderName
    RecipientID: string;				// RecipientID
    RecipientUserID: string;			// RecipientUserID
    RecipientVersion: string;		    // RecipientVersion
    RecipientType: string;				// RecipientType
    RecipientDepartment: string;        // RecipientDepartment
    RecipientSection: string;		    // RecipientSection
    RecipientRole: string;				// RecipientRole
    RecipientName: string;				// RecipientName
    CCSet: any;						// CCSet
    Disposition1: string;
    Disposition2: string;
    Disposition3: string;
    CoverID: string;	                 // CoverID
    ArabicSubject: string;		        // ArabicSubject
    EnglishSubject: string;		        // EnglishSubject 
    CoverDate: string;		            // CoverDate 
    DocumentNumber: string;	            // DocumentNumber
    Priority: string;					// Priority
    CorrespondenceType2: string;		// CorrespondenceType2
    IDNumber: string; 					// IDNumber
    BaseType: string;					// BaseType
    ProjectCode: string;				// ProjectCode
    BudgetNumber: string;			    // BudgetNumber
    CommitmentNumber: string;		    // CommitmentNumber
    TenderNumber: string;			    // TenderNumber
    CompanyRegistrationNumber: string;	// CompanyRegistrationNumber
    ContractNumber: string;			    // ContractNumber
    StaffNumber: string;				// StaffNumber
    CorrespondencePurpose: string;		// CorrespondencePurpose
    TempLanguage: string;
    FillingFilePlanPath: string;


    CorrespondenceFlowType: string;
    CorrespondenceYear: string;
    DocumentType: string;
    CorrespondenceDueDate: string;
    HeadOfSectionRequired: string;
    CorrespondencePhase: string;
}