import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, treatment, message } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Navn, email og besked er påkrævet' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Ugyldig email-adresse' },
        { status: 400 }
      )
    }

    // Map treatment value to Danish
    const treatmentMap: Record<string, string> = {
      konsultation: 'Konsultation',
      vaccination: 'Vaccination',
      operation: 'Operation',
      andet: 'Andet',
    }

    const treatmentLabel = treatment ? treatmentMap[treatment] || treatment : 'Ikke angivet'

    // Send email to the clinic
    const { error } = await resend.emails.send({
      from: 'Synnes Dyreklinik <noreply@synnesdyreklinik.dk>',
      to: ['info@synnesdyreklinik.dk'],
      replyTo: email,
      subject: `Ny henvendelse fra ${name} - ${treatmentLabel}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #611471;">Ny henvendelse fra hjemmesiden</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 150px;">Navn:</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Telefon:</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${phone || 'Ikke angivet'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Behandling:</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${treatmentLabel}</td>
            </tr>
          </table>
          
          <div style="margin-top: 20px;">
            <h3 style="color: #611471;">Besked:</h3>
            <p style="background: #f5f5f5; padding: 15px; border-radius: 8px; white-space: pre-wrap;">${message}</p>
          </div>
          
          <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;" />
          <p style="color: #888; font-size: 12px;">
            Denne email er sendt fra kontaktformularen på synnesdyreklinik.dk
          </p>
        </div>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json(
        { error: 'Kunne ikke sende besked. Prøv igen senere.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Der opstod en fejl. Prøv igen senere.' },
      { status: 500 }
    )
  }
}
