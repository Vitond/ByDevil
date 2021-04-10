from flask import Flask, jsonify, request, abort
from flask_mail import Mail, Message
from bs4 import BeautifulSoup
import stripe
import pdfkit
from datetime import date
import pymongo
from bson.objectid import ObjectId
import re

# SETUP

mongo_client = pymongo.MongoClient("mongodb://Ove:rofl@clustr-shard-00-00.bdnkm.mongodb.net:27017,clustr-shard-00-01.bdnkm.mongodb.net:27017,clustr-shard-00-02.bdnkm.mongodb.net:27017/db?ssl=true&replicaSet=atlas-rqnhtl-shard-0&authSource=admin&retryWrites=true&w=majority")

database = mongo_client["db"]

orders = database["orders"]

stripe.api_key = 'sk_test_51IY5xGHloBxDNHwGowYBslzs8Y3Y29joKAEX3TbNm59TGym59AgIk7hlE8jDZMDElHumAs8XpRWTcrrd4xozLnwv00I6ZJPgv6'

invoice_count = 1

app = Flask(__name__)
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_USE_SSL'] =  True
app.config['MAIL_USE_TSL'] =  True
app.config['MAIL_PASSWORD'] = 'S&2?_:xBdG.D6b[p'
app.config['MAIL_USERNAME'] = 'tmailestest@gmail.com'
app.config['MAIL_PORT'] = 465
app.config["MONGO_URI"] = "mongodb://localhost:27017/db"
mail = Mail(app)

application = app

DOMAIN = 'http://localhost:3000'

MAIL_SENDER = "tmailestest@gmail.com"

# PRODUCTS AND DELIVERY

products = [
    {
      'description': 'Lorem impusm ronlaní písmoLorem impusm ronlaní písmoLorem impusm ronlaní písmoLorem impusm ronlaní písmoLorem impusm ronlaní písmoLorem impusm ronlaní písmoLorem impusm ronlaní písmoArchitects DaughterArchitects DaughterArchitects DaughterArchitects Daughter',
      'imageSrcPath': "/img/sweatshirt.png",
      'id': 0,
      'name': 'XD',
      'price': 500
    },
    {
      'description': 'Lorem impusm ronlaní písmoLorem impusm ronlaní písmoLorem impusm ronlaní písmoLorem impusm ronlaní písmoLorem impusm ronlaní písmoLorem impusm ronlaní písmoLorem impusm ronlaní písmoArchitects DaughterArchitects DaughterArchitects DaughterArchitects Daughter',
      'imageSrcPath': "/img/sweatshirt.png",
      'id': 1,
      'name': 'LOL',
      'price': 400
    }
]

deliveryPrices = {
  'PPL': 60,
  'POST': 70,
  'DPP': 80
}

delivery = {
  'PPL': 'PPL',
  'POST': 'POST',
  'DPP': 'DPP'
}

payment = {
  'DOB': 'DOB',
  'CARD': 'CARD',
  'TRANS': 'TRANS'
}

regexp_map = {
  'name': "(.+){2,}",
  'surname': "(.+){2,}",
  'telephone': "^[0-9]{9}$",
  'email': "^[a-zA-Z0-9!#$_*?^{}~-]+(\.[a-zA-Z0-9!#$_*?^{}~-]+)*@([a-zA-Z-]+\.)+[a-zA-z]{2,}$",
  'street': "(.+){2,}",
  'city': "(.+){2,}",
  'zipcode': "^[0-9]{5}$",
  'delivery': ".*",
  'payment': ".*"
}


# UTILITY

def validate_products(prods):
  global products
  if str(type(prods)) != "<class 'list'>":
    return "Products should be a list"
  if len(prods) < 1:
    return "Basket is empty"
  for prod in prods:
    if not isinstance(prod['id'], int) or isinstance(prod['amount'], int):
      if not products[prod['id']] or not prod['amount']:
        return "Invalid products"
    else:
      return "Product id is not integer or product amount is not integer"
  return None

def send_order_mail(order):

  payment_value = order['data']['payment']
  delivery_value = order['data']['delivery']

  body = None

  greetings = "\n\nPřežívej,\nByDevil"

  if payment_value = payment['CARD']:
    body = f"Došla nám objednávka tvýho oblečení a v příloze posíláme fakturu. Vybral jsi platbu kartou, takže jen počkáme než nám úspěšně dojdou peníze a do dvou dnů to pošlem.{greetings}"
  elif payment_value = payment['DOB']:
    body = f"Došla nám objednávka tvýho oblečení a v příloze posíláme fakturu. Máš to na dobírku, takže si jen připrav hotovost a do dvou dnů to expedujeme.{greetings}"
  elif payment_value = payment['TRANS']:
    body = f"Došla nám objednávka tvýho oblečení a v příloze posíláme fakturu. Pro platbu převodem použij naše číslo účtu XXXXXXXX/XXXX a variabilní symbol XXXXXXXX. Jakmile nám dojdou peníze, do dvou dnů ti pošlem oblečení.{greetings}"

  generate_invoice(order)

  msg = Message(f"ByDevil - objednávka č. {order['number']}",
                  sender=MAIL_SENDER,
                  recipients=order['data']['email'],
                  body=body)
  with app.open_resource("invoice/invoice.pdf") as fp:
        msg.attach("invoice.pdf", "text/pdf", fp.read())
  mail.send(msg)

def generate_invoice(order):
  generate_invoice_html(order)
  generate_invoice_pdf()

def validate_order_data(data):
  required_fields = ['name', 'surname', 'telephone', 'email', 'street', 'city', 'zipcode', 'payment', 'delivery', 'products']
  for field in required_fields:
    if not field in data:
      return f"Missing {field}"
  for key in data:
    if key != 'products':
      if not re.search(regexp_map[key], data[key]):
        return f"{key} is invalid"
  return None

def generate_invoice_html(order, storno=false):
    prods = order['data']['products']
    delivery_value = order['data']['delivery']

    html = open("invoice/template.html").read()
    soup = BeautifulSoup(html, features="html.parser")

    invoice_number = soup.find(id='invoice-number')
    invoice_number.string = str(invoice_count)

    today = date.today()
    formatted_date = today.strftime("%d.%m.%Y")

    invoice_date = soup.find(id='invoice-date')
    invoice_date.string = formatted_date

    pay_date = soup.find(id='pay-date')
    pay_date.string = formatted_date

    convertedProducts = []
    for product in prods:
      existingProduct = None
      if len(convertedProducts) > 0:
        existingProduct = next(filter(lambda x: x['id'] == product['id'], convertedProducts))
      if existingProduct:
        existingProduct['amount'] += product['amount']
      else:
        convertedProducts.append({'id': product['id'], 'amount': product['id']})

    table_body = soup.find(id='tbody')

    def create_row(*args):
      tr = soup.new_tag('div')
      tr['class'] = 'table-row'
      table_body.append(tr)

      for field in args:
        p = soup.new_tag('p')
        p.string = field
        tr.append(p)

    for product in convertedProducts:
      global products
      create_row(products[product['id']]['name'], f"{product['amount']} ks", f"{products[product['id']]['price']} Kč", f"{products[product['id']]['price']*product['amount']} Kč")

    delivery_text = None
    if delivery_value = delivery['POST']:
      delivery_text = "Pošta"
    elif delivery_value = delivery['PPL']:
      delivery_text = "PPL"
    elif delivery_value = delivery['DPD']:
      delivery_text = "DPD"

    payment_text = None
    payment_value = order['data']['payment']
    if payment_value = payment['CARD']:
      payment_text = "Platba kartou"
    elif payment_value = payment['TRANS']:
      payment_text = "Platba převodem"
    elif payment_value = payment['DOB']:
      payment_text = "Platba dobírkou"

    create_row(delivery_text, "1ks", f"{deliveryPrices[delivery_value]} Kč", f"{deliveryPrices[delivery_value]} Kč")
    create_row(payment_text, "1 ks", f"{paymentPrices[payment_value]} Kč", f"{paymentPrices[payment_value]} Kč")

    with open(f"invoice/invoice-{order['databaseId']}.html", "w+") as file:
      file.write(str(soup))

def generate_invoice_pdf(order):
  options = {
    'page-size': 'A4',
    'dpi': 400,
    'margin-top': '0in',
    'margin-right': '0in',
    'margin-bottom': '0in',
    'margin-left': '0in',
  }
  pdfkit.from_file(f"invoice/invoice-{order['databaseId']}.html", f"invoice/invoice-{order['databaseId']}.pdf", options=options)
  os.remove(f"invoice/invoice-{order['databaseId']}.html")


def send_invoice(**args):
  msg = Message("Hello",
                  sender="tmailestest@gmail.com",
                  recipients=["ove.vitula@gmail.com"],
                  body="Posilame fakturu")
  with app.open_resource("invoice/invoice.pdf") as fp:
        msg.attach("invoice.pdf", "text/pdf", fp.read())
  mail.send(msg)

  global invoice_count
  invoice_count += 1

def calculate_order_total(items):
  total = 0
  for item in items:
    product = next(filter(lambda x: x['id'] == item['id'], products))
    total += product['price']*item['amount']
  return total

# /CREATE-PAYMENT-INTENT
@app.route('/create-payment-intent', methods = ['POST'])
def create_payment():
    try:
        data = request.get_json()
        if not 'items' in data:
          return "Missing items", 400
        if not 'databaseId' in data:
          return 'Missing database id', 400
        error_message = validate_products(data['items'])
        if error_message:
          return error_message, 400
        totalAmount = calculate_order_total(data['items'])
        intent = stripe.PaymentIntent.create(
            amount=totalAmount*100,
            currency='czk'
        )
        existing_order = orders.find_one_and_update(
          {"_id" : ObjectId(data['databaseId'])},
          {"$set":
            {"intent_id": intent['id']}
          },upsert=True
          )
        if not existing_order:
          return "Database id is invalid", 400
        return jsonify({
          'clientSecret': intent['client_secret'],
          'price': totalAmount
        })
    except Exception as e:
      print(str(e))
      return jsonify(error=str(e)), 403

# /TEST
@app.route('/test')
def test():
  data = request.get_json()

  if not 'products' in data or not 'delivery' in data:
    return "Missing products or delivery in request body", 400

  if not data['delivery'] in deliveryPrices:
    return "Invalid delivery", 400

  if str(type(data['products'])) != "<class 'list'>":
    return "Products should be a list", 400

  for product in data['products']:
    if not 'amount' in product or not 'id' in product:
      return "Product missing amount or id", 400

  generate_invoice_html(data['products'], data['delivery'])
  generate_invoice_pdf()
  send_invoice()
  return "lol"

# /WEBHOOKS
@app.route('/webhooks', methods=['POST'])
def webhook():
  if request.method == 'POST':
    print (request.json['type'])
    if request.json['type'] == 'charge.succeeded':
      data = request.json

      # print(data)
      # print (f"pi_{data['data']['object']['payment_intent']}")

      order = orders.find_one({'intent_id': data['data']['object']['payment_intent']})
      if not order:
        return "Id of this payment intent is not stored in the database", 400
      
      orders.update_one({'intent_id': data['data']['object']['payment_intent']}, { "$set": { "paid": "True" } })
      # order = orders.find_one_and_update({'intent_id': data['data']['object']['payment_intent']}, {"$set":
      #       {"paid": True}
      #       }, upsert=True
      #     )
      print(order)
            
    return 'success', 200
  else:
    abort(400)

# /PRODUCTS
@app.route('/products', methods=['GET'])
def get_items():
  return jsonify({'products': products})

# /ORDERS
@app.route('/orders', methods=['POST'])
def post_order():
  data = request.get_json()
  
  error_message = validate_order_data(data)

  if error_message:
    return error_message, 400

  error_message = validate_products(data['products']) 

  if error_message:
    return error_message, 400

  delivery_value = data['delivery']
  payment_value = data['payment']

  if not delivery_value in delivery:
    return "Invalid delivery",400

  if not payment_value in payment:
    return "Invalid payment", 400

  number = orders.estimated_document_count() + 1
  numberList = [int(digit) for digit in str(number)]
  while len(numberList) < 4:
    numberList.insert(0, 0)
  number_string = "BD-" + ''.join(map(str, numberList))  + "/2021"
  variable_number_string = ''.join(map(str, numberList)) + "2021"

  order = {'number': number_string, 'data': data, 'paid': False, 'variableNumber': variable_number_string, 'intent_id': None, 'expeded': False, 'finished': False}

  inserted_order = orders.insert_one(order)
  _id = inserted_order.inserted_id

  send_order_mail(order)
  # if order['data']['payment'] == payment['CARD']:
  #   msg = Message(f"ByDevil - objednávka č. {variable_number_string}",
  #                 sender="tmailestest@gmail.com",
  #                 recipients=["ove.vitula@gmail.com"],
  #                 body=f"Došla nám objednávka tvýho oblečení a v příloze posíláme fakturu. Vybral jsi platbu kartou, takže jen počkáme než nám úspěšně dojdou peníze a do dvou dnů to pošlem.\nPřežívej,\nByDevil")
  #   mail.send(msg)
  # elif order['data']['payment'] == payment['TRANS']:
  #   msg = Message(f"ByDevil - objednávka č. {variable_number_string}",
  #                 sender="tmailestest@gmail.com",
  #                 recipients=["ove.vitula@gmail.com"],
  #                 body=f"Došla nám objednávka tvýho oblečení a v příloze posíláme fakturu. Pro platbu převodem použij naše číslo účtu XXXXXXXX/XXXX a variabilní symbol {variable_number_string}. Jakmile nám dojdou peníze, do dvou dnů ti pošlem oblečení.")    
  #   mail.send(msg)
  #   pass
  # elif order['data']['payment'] == payment['DOB']:
  #   msg = Message(f"ByDevil - objednávka č. {variable_number_string}",
  #                 sender="tmailestest@gmail.com",
  #                 recipients=["ove.vitula@gmail.com"],
  #                 body="Došla nám objednávka tvýho oblečení a v příloze posíláme fakturu. Máš to na dobírku, takže si jen připrav hotovost a do dvou dnů to expedujeme.\nPřežívej,\nByDevil")
  #   mail.send(msg)
  # else:
  #   return "Invalid payment", 400

  return jsonify({'database_id': str(_id)}), 200


if __name__ == '__main__':
    app.run(port=5000)
