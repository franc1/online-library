import { PrintingOffice } from 'src/printing-office/models/printing-office.model';
import { EntityRepository } from 'typeorm';

import { BaseRepository } from './base.repository';

@EntityRepository(PrintingOffice)
export class PrintingOfficeRepository extends BaseRepository<PrintingOffice> {}
