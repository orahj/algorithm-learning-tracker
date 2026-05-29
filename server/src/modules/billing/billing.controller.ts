import { Body, Controller, Headers, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { BillingService } from './billing.service';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';

@Controller('billing')
@ApiTags('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post('checkout-session')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  createCheckoutSession(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateCheckoutSessionDto) {
    return this.billingService.createCheckoutSession(user, dto.plan);
  }

  @Post('webhook')
  async webhook(@Req() request: Request & { rawBody?: Buffer }, @Headers('stripe-signature') signature?: string) {
    if (!request.rawBody || !signature) return { received: false };
    const event = this.billingService.constructWebhookEvent(request.rawBody, signature);
    return this.billingService.handleWebhook(event);
  }
}
