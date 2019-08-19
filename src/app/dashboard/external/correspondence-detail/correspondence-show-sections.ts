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

  }
