import { environment } from '@/shared/environment'
import Mailchimp  from '@mailchimp/mailchimp_transactional'


export class MailchimpTransactionalService {
  constructor (
    private mailchimp = Mailchimp(environment.mailchimp.apiKey)
  ) {}

  async test () {
    const response = await this.mailchimp.users.ping()
    console.log(response)
  }
}