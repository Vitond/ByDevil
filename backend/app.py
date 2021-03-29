from flask import Flask, jsonify, request, abort
from flask_mail import Mail, Message
from bs4 import BeautifulSoup
import stripe
import pdfkit



app = Flask(__name__)
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_USE_SSL'] =  True
app.config['MAIL_USE_TSL'] =  True
app.config['MAIL_PASSWORD'] = 'S&2?_:xBdG.D6b[p'
app.config['MAIL_USERNAME'] = 'tmailestest@gmail.com'
app.config['MAIL_PORT'] = 465
mail = Mail(app)

DOMAIN = 'http://localhost:3000'

@app.route('/create-checkout-session', methods = ['POST'])
def create_payment():
    try:
        data = json.loads(request.data)
        intent = stripe.PaymentIntent.create(
            amount=calculate_order_amount(data['items']),
            currency='usd'
        )
        return jsonify({
          'clientSecret': intent['client_secret']
        })
    except Exception as e:
        return jsonify(error=str(e)), 403
    
@app.route('/webhooks', methods=['POST'])
def webhook():
  if request.method == 'POST':
    if request.json['type'] == 'charge.succeeded':
      data = request.json
      
      html = open("invoice/invoice.html").read()
      soup = BeautifulSoup(html, features="html.parser")
      div = soup.find(id='div')
      div.string = "Random textík"
      with open("invoice/output.html", "w") as file:
        file.write(str(soup))
      pdfkit.from_file('invoice/output.html', 'invoice/invoice.pdf')

      msg = Message("Hello",
                  sender="tmailestest@gmail.com",
                  recipients=["ove.vitula@gmail.com"],
                  body="Posilame fakturu")
      with app.open_resource("invoice/invoice.pdf") as fp:
        msg.attach("invoice.pdf", "text/pdf", fp.read())
      mail.send(msg)
    return 'success', 200
  else:
    abort(400)

if __name__ == '__main__':
    app.run(port=5000)