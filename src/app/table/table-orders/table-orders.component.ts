import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TableDataSharingService } from 'src/app/services/table-data-sharing.service';


@Component({
  selector: 'app-table-orders',
  templateUrl: './table-orders.component.html',
  styleUrls: ['./table-orders.component.css']
})
export class TableOrdersComponent implements OnInit {
  custName: any = null;
  isValid!: boolean;
  formGroup!: FormGroup
  selectedItem: any;
  table: any;

  products: any;
  visible: boolean = true;
  userMobile: any = null;
  isName!: boolean;

  constructor(private router: Router, private route: ActivatedRoute, private tableDataSharing: TableDataSharingService) { }

  ngOnInit(): void {
    this.getTableDetails();
  }

  getTableDetails() {
    this.table = this.tableDataSharing.getTable();

  }

  redirectToMenu(table: any) {
    this.router.navigate(['tableMenu']);
  }

  ganrateInvoice() {
    this.router.navigate(['ganrateInvoice']);
  }

  validateCustName() {
     // Regex pattern to allow only alphabetic characters and ensure custName is not empty
  const pattern = /^[A-Za-z\s]+$/;
  // Test for both non-null and pattern match
  this.isName = !!this.custName && pattern.test(this.custName);
  }
  validateMobileNumber() {
    const pattern = /^\d{10}$/; // Adjust the regex as needed
    this.isValid = pattern.test(this.userMobile);
  }

  
}
