import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RegistrationsService } from './registrations.service';
import { CreateRegistrationDto } from './create-registration.dto';
import { UpdateRegistrationStatusDto } from './update-registration-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('registrations')
@UseGuards(JwtAuthGuard)
export class RegistrationsController {
  constructor(private readonly registrationsService: RegistrationsService) {}

  // Citizen submit: one request -> owner + vehicle + registration
  @Post()
  create(@Req() req: any, @Body() dto: CreateRegistrationDto) {
    return this.registrationsService.create(dto, req.user.userId);
  }

  // Later you can split citizen/admin behavior using roles,
  // for now JwtAuthGuard protects the list.
  @Get()
  findAll(@Req() req: any) {
    return req.user.role === 'ADMIN' ? this.registrationsService.findAll() : this.registrationsService.findAllForUser(req.user.userId);
  }

  // @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Req() req: any, @Param('id') id: string) {
    return req.user.role === 'ADMIN' ? this.registrationsService.findOne(id) : this.registrationsService.findOneForUser(id, req.user.userId);
  }

  // This should later be admin-only with a RolesGuard
  // @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  updateStatus(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateRegistrationStatusDto,
  ) {
    if (req.user.role !== 'ADMIN') throw new ForbiddenException('Administrator access required');
    return this.registrationsService.updateStatus(id, dto);
  }

  @Post(':id/attachments')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 10 * 1024 * 1024 } }))
  async uploadAttachment(@Req() req: any, @Param('id') id: string, @UploadedFile() file?: Express.Multer.File) {
    if (!file) throw new BadRequestException('A file is required');
    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.mimetype)) throw new BadRequestException('Only PDF, JPEG, PNG, and WebP files are allowed');
    if (req.user.role !== 'ADMIN') await this.registrationsService.findOneForUser(id, req.user.userId);
    return this.registrationsService.addAttachment(id, file);
  }

  @Get('attachments/:attachmentId/download')
  async downloadAttachment(@Req() req: any, @Param('attachmentId') attachmentId: string) {
    return this.registrationsService.getAttachmentUrl(attachmentId, req.user.userId, req.user.role === 'ADMIN');
  }
}
