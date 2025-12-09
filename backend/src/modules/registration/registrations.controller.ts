import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RegistrationsService } from './registrations.service';
import { CreateRegistrationDto } from './create-registration.dto';
import { UpdateRegistrationStatusDto } from './update-registration-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/registrations')
export class RegistrationsController {
  constructor(private readonly registrationsService: RegistrationsService) {}

  // Citizen submit: one request -> owner + vehicle + registration
  // @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateRegistrationDto) {
    // const userId = req.user.userId; // from JwtStrategy validate()
    return this.registrationsService.create(dto); // later add userId in the parameter .create(dto, userId)
  }

  // Later you can split citizen/admin behavior using roles,
  // for now JwtAuthGuard protects the list.
  // @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req: any, @Query('userOnly') userOnly?: string) {
    if (userOnly === 'true') {
      return this.registrationsService.findAllForUser(req.user.userId);
    }
    return this.registrationsService.findAll();
  }

  // @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Req() req: any, @Param('id') id: string) {
    // simple version: admin vs citizen logic not added yet
    return this.registrationsService.findOne(id);
  }

  // This should later be admin-only with a RolesGuard
  // @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateRegistrationStatusDto,
  ) {
    return this.registrationsService.updateStatus(id, dto);
  }
}
