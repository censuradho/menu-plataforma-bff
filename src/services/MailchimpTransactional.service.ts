import { environment } from '@/shared/environment'
import Mailchimp  from '@mailchimp/mailchimp_transactional'


export class MailchimpTransactionalService {
  constructor (
    private mailchimp = Mailchimp(environment.mailchimp.mandrillApiKey)
  ) {}

  async sendTemplate (request: Mailchimp.MessagesSendTemplateRequest) {
    return await this.mailchimp.messages.sendTemplate(request)
  }
}