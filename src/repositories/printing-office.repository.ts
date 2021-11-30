import { PrintingOffice } from 'src/models/printing_office.model';
import { EntityRepository } from 'typeorm';

import { BaseRepository } from './base.repository';

@EntityRepository(PrintingOffice)
export class PrintingOfficeRepository extends BaseRepository<PrintingOffice> {}
