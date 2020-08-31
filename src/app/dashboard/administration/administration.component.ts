import { Component, OnInit, ViewChild } from '@angular/core';
import { AdministrationService } from 'src/app/dashboard/services/administration.service';
import { ErrorHandlerFctsService } from 'src/app/dashboard/services/error-handler-fcts.service';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.scss']
})
export class AdministrationComponent implements OnInit {
  private structureJson: any;
  private pageStructure: any;
  public possibleAction = 'Expand All';

  @ViewChild(MatAccordion) accordion: MatAccordion;

  constructor(
    private _administration: AdministrationService
    , private _errorHandlerFctsService: ErrorHandlerFctsService
  ) { }

  ngOnInit() {
    this.getAdminPageStructure();
  }

  accordionAction() {
    if (this.possibleAction === 'Expand All') {
      this.accordion.openAll();
      this.possibleAction = 'Collapse All';
    } else {
      this.accordion.closeAll();
      this.possibleAction = 'Expand All';
    }
  }

  getAdminPageStructure(): void {
    this._administration.getAdminPageStructure().subscribe(
      response => {
        this.structureJson = response;
        this.pageStructure = this.structureJson;
      },
      responseError => {
        this._errorHandlerFctsService.handleError(responseError).subscribe();
      }
    );
  }

  searchInAdminStructure(searchString: string) {
    if (searchString.length > 0) {
      const filteredData = this.filterData(this.structureJson, function (item) {
        let result = false;
        console.log(item.name.en)
        if (item.name.en.toLowerCase().indexOf(searchString.toLowerCase()) > -1 ||
          item.name.ar.toLowerCase().indexOf(searchString.toLowerCase()) > -1) {
          result = true;
        } else if (item.description) {
          if (item.description.en.toLowerCase().indexOf(searchString.toLowerCase()) > -1 ||
            item.description.ar.toLowerCase().indexOf(searchString.toLowerCase()) > -1) {
            result = true;
          }
        }
        return result;
      });
      console.log(filteredData);
      this.pageStructure = filteredData;
      this.accordion.openAll();
    } else {
      this.pageStructure = this.structureJson;
    }
  }

  filterData(data: any, predicate) {
    return !!!data ? null : data.reduce((list, entry) => {
      let clone = null;
      if (predicate(entry)) {
        clone = Object.assign({}, entry);
        clone.wanted = true;
      } else if (entry.children != null) {
        let children = this.filterData(entry.children, predicate);
        if (children.length > 0) {
          clone = Object.assign({}, entry, { children: children });
        }
      }
      clone ? clone.expand = true : null
      clone && list.push(clone);
      return list;
    }, []);
  }

}
