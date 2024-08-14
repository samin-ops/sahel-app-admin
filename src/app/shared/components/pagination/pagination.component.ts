import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageMeta } from '../../dtos/responses/shared/page.meta.dto';
import { PaginationRequestDto } from '../../dtos/requests/base.dto';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input() pageMeta: PageMeta;
  @Output() loadMore: EventEmitter<PaginationRequestDto> = new EventEmitter();

  totalItemsCount: number;
  lastRecord: number;
  firstRecord: number;

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.pageMeta) {
      this.lastRecord =
        this.pageMeta.current_items_count + this.pageMeta.offset;
      this.firstRecord = this.pageMeta.offset + 1;
      this.totalItemsCount = this.pageMeta.total_items_count;
    }
  }

  fetchMore(page: number, pageSize: number) {
    this.loadMore.emit({ page, pageSize });
  }
}
