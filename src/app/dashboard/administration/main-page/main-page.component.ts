import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ErrorHandlerFctsService } from 'src/app/dashboard/services/error-handler-fcts.service';
import { MatAccordion } from '@angular/material/expansion';
import { FCTSDashBoard } from 'src/environments/environment';
import { multiLanguageTranslator } from 'src/assets/translator/index';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})

export class MainPageComponent implements OnInit {
  pageStructure: any;
  possibleAction = 'Expand All';
  basehref: string = FCTSDashBoard.BaseHref;

  @Input() structureJson;
  @ViewChild(MatAccordion) accordion: MatAccordion;

  constructor(
    public translator: multiLanguageTranslator
  ) { }

  ngOnInit() {
    this.pageStructure = this.structureJson;
  }

  accordionAction(): void {
    if (this.possibleAction === 'Expand All') {
      this.accordion.openAll();
      this.possibleAction = 'Collapse All';
    } else {
      this.accordion.closeAll();
      this.possibleAction = 'Expand All';
    }
  }

  searchInAdminStructure(searchString: string): void {
    if (searchString.length > 0) {
      const filteredData = this.filterData(this.structureJson, function (item) {
        let result = false;
        if (Object.keys(item).length > 0) {
          if (item.name.en.toLowerCase().indexOf(searchString.toLowerCase()) > -1 ||
            item.name.ar.toLowerCase().indexOf(searchString.toLowerCase()) > -1) {
            result = true;
          } else if (item.description) {
            if (item.description.en.toLowerCase().indexOf(searchString.toLowerCase()) > -1 ||
              item.description.ar.toLowerCase().indexOf(searchString.toLowerCase()) > -1) {
              result = true;
            }
          }
        }
        return result;
      });
      console.log('filteredData', filteredData)
      this.pageStructure = filteredData;
      setTimeout(() => {
        this.accordion.openAll();
        this.possibleAction = 'Collapse All';
      }, 250);
    } else {
      this.pageStructure = this.structureJson;
      this.possibleAction = 'Expand All';
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
