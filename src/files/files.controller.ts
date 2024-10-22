import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MulterConfigService } from './files..config';
import { Roles } from '../decorator/customize';
import { Role } from '../enum/role.enum';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('single')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file upload');
    }
    return {
      data: file.filename,
      message: 'File uploaded successfully',
    };
  }

  @Post('multiple')
  @Roles(Role.Admin)
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      // 'files' is the field name, 5 is the max count
      storage: new MulterConfigService().createMulterOptions().storage,
      fileFilter: new MulterConfigService().createMulterOptions().fileFilter,
      limits: new MulterConfigService().createMulterOptions().limits,
    }),
  )
  uploadMultipleFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    return {
      data: files.map((file) => file.filename),
      message: 'Files uploaded successfully',
    };
  }
}
