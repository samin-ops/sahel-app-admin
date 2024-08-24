import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AddressDto,
  AddressListResponseDto,
} from 'src/app/shared/dtos/responses/address/addresses.dto';
import { AddressesService } from 'src/app/shared/services/addresses.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-address-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './address-list.component.html',
  styleUrls: ['./address-list.component.css'],
})
export class AddressListComponent implements OnInit {
  addresses: AddressDto[];

  constructor(private addresService: AddressesService) {}

  ngOnInit() {
    this.addresService.fetchAll().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.addresses = (res as AddressListResponseDto).addresses;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
