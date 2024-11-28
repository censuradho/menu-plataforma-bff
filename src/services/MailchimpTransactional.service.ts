import { environment } from '@/shared/environment'
import Mailchimp  from '@mailchimp/mailchimp_transactional'


export class MailchimpTransactionalService {
  constructor (
    private mailchimp = Mailchimp(environment.mailchimp.mandrillApiKey)
  ) {}

  async send (request: Mailchimp.MessagesSendRequest) {
    return await this.mailchimp.messages.send(request)
  }
}