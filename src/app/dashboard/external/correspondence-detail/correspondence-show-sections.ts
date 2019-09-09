import { CorrespondenenceDetailsModel } from '../../models/CorrespondenenceDetails.model';

interface SectionParam {
    Show: boolean;
    Modify: boolean;
  }

  interface CorrSectionList {
    Sender: SectionParam;
    Recipient: SectionParam;
    CC: SectionParam;
    Correspondence: SectionParam;
    Cover: SectionParam;
    Attachments: SectionParam;
    UserCollaboration: SectionParam;
    LinkedCorrespondence: SectionParam;
    Comments: SectionParam;
    Transfer: SectionParam;
    Distribution: SectionParam;
  }
  interface CorrItemsList {
    regDate:            SectionParam;
    docsDate:           SectionParam;
    confidential:       SectionParam;
    priority:           SectionParam;
    refNumber:          SectionParam;
    personalName:       SectionParam;
    idNumber:           SectionParam;
    correspondenceType: SectionParam;
    baseType:           SectionParam;
    arabicSubject:      SectionParam;
    englishSubject:     SectionParam;
    projectCode:        SectionParam;
    budgetNumber:       SectionParam;
    contractNumber:     SectionParam;
    tenderNumber:       SectionParam;
    corrNumber:         SectionParam;
    fillinPlanPath:     SectionParam;
    dispatchMethod:     SectionParam;
    staffNumber:        SectionParam;
  }

  interface CorrItemsList {
    regDate:            SectionParam;
    docsDate:           SectionParam;
    confidential:       SectionParam;
    priority:           SectionParam;
    refNumber:          SectionParam;
    personalName:       SectionParam;
    idNumber:           SectionParam;
    correspondenceType: SectionParam;
    baseType:           SectionParam;
    arabicSubject:      SectionParam;
    englishSubject:     SectionParam;
    projectCode:        SectionParam;
    budgetNumber:       SectionParam;
    contractNumber:     SectionParam;
    tenderNumber:       SectionParam;
    corrNumber:         SectionParam;
    fillinPlanPath:     SectionParam;
    dispatchMethod:     SectionParam;
    staffNumber:        SectionParam;
  }

  export class ShowSections implements CorrSectionList {
      public Sender: SectionParam;
      public Recipient: SectionParam;
      public CC: SectionParam;
      public Correspondence: SectionParam;
      public Cover: SectionParam;
      public Attachments: SectionParam;
      public UserCollaboration: SectionParam;
      public LinkedCorrespondence: SectionParam;
      public Comments: SectionParam;
      private _Transfer: SectionParam;
      private _Distribution: SectionParam;



    public get Distribution(): SectionParam {
        return this._Distribution;
    }
    public set Distribution(value: SectionParam) {
        this._Distribution = value;
    }

    public get Transfer(): SectionParam {
        return this._Transfer;
    }
    public set Transfer(value: SectionParam) {
        this._Transfer = value;
    }

    constructor() {
      this._setInitData();
    }

    private _setInitData() {
      this.Sender = { Show: true, Modify: false };
      this.Recipient = { Show: true, Modify: false };
      this.CC = { Show: true, Modify: false };
      this.Correspondence = { Show: true, Modify: false };
      this.Cover = { Show: true, Modify: false };
      this.Attachments = { Show: true, Modify: false };
      this.UserCollaboration = { Show: true, Modify: false };
      this.LinkedCorrespondence = { Show: true, Modify: false };
      this.Comments = { Show: true, Modify: false };
      this.Transfer = { Show: true, Modify: false };
      this.Distribution = { Show: false, Modify: false };
    }


    public ShowCorrSection(correspondenceData: CorrespondenenceDetailsModel, CorrespondencType: string, taskID: string) {
        if ( ( correspondenceData.ID.toString() !== '0' && correspondenceData.holdSecretaryID.toString() !== '0'  && ( correspondenceData.Status.toString() === '0' || correspondenceData.Status.toString() === '1' ) )
         || ( correspondenceData.ID.toString() === '0' && correspondenceData.isCC.toString() === '1' && correspondenceData.CCstatus !== 'Archived')
         || (correspondenceData.perform07.toString() === '1' && correspondenceData.CCstatus !== 'Archived')
         ) {
            this.Transfer.Modify = true;
        } else {
          this.Transfer.Modify = false;
        }
        console.log(this);
    }

    public ShowCorrSectionWF() {
      this._ShowSectionWFIncoming();
    }

    private _ShowSectionWFIncoming() {
        this.Transfer.Show = false;
        this.UserCollaboration.Show = false;
    }

  }

  export class ShowCorrItems implements CorrItemsList {
    public regDate:            SectionParam;
    public docsDate:           SectionParam;
    public confidential:       SectionParam;
    public priority:           SectionParam;
    public refNumber:          SectionParam;
    public personalName:       SectionParam;
    public idNumber:           SectionParam;
    public correspondenceType: SectionParam;
    public baseType:           SectionParam;
    public arabicSubject:      SectionParam;
    public englishSubject:     SectionParam;
    public projectCode:        SectionParam;
    public budgetNumber:       SectionParam;
    public contractNumber:     SectionParam;
    public tenderNumber:       SectionParam;
    public corrNumber:         SectionParam;
    public fillinPlanPath:     SectionParam;
    public dispatchMethod:     SectionParam;
    public staffNumber:        SectionParam;

  constructor() {
    this._setCorrItems();
  }

  private _setCorrItems() {
    this.regDate =            { Show: true, Modify: false };
    this.docsDate =           { Show: true, Modify: true };
    this.confidential =       { Show: true, Modify: false };
    this.priority =           { Show: true, Modify: true };
    this.refNumber =          { Show: true, Modify: true };
    this.personalName =       { Show: true, Modify: true };
    this.idNumber =           { Show: true, Modify: true };
    this.correspondenceType = { Show: true, Modify: true };
    this.baseType =           { Show: true, Modify: true };
    this.arabicSubject =      { Show: true, Modify: true };
    this.englishSubject =     { Show: true, Modify: true };
    this.projectCode =        { Show: true, Modify: true };
    this.budgetNumber =       { Show: true, Modify: true };
    this.contractNumber =     { Show: true, Modify: true };
    this.tenderNumber =       { Show: true, Modify: true };
    this.corrNumber =         { Show: true, Modify: false };
    this.fillinPlanPath =     { Show: true, Modify: true };
    this.dispatchMethod =     { Show: true, Modify: true };
    this.staffNumber =        { Show: true, Modify: true };
  }
}
