import sys
if sys.platform == "win32":
    sys.path.append(sys.path[0] + "\\site-packages\\windows")
elif sys.platform =="linux":
    sys.path.append(sys.path[0] + "/site-packages/linux")
from flask import Flask, request, redirect
from pyngrok import ngrok

# dev additions
from twilio.twiml.messaging_response import MessagingResponse
#

app = Flask(__name__)
app.config.update(
    # SERVER_NAME="127.0.0.1:3005",
    USE_NGROK=True
)


@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', '*')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  return response

current = None
use = False

@app.route("/sms", methods=['GET', 'POST'])
def map_game():
    # configure app to work with directions
    body = request.values.get('Body', None)

    # Start our TwiML response
    resp = MessagingResponse()

    global current
    global use
    current = body
    use = True

    # Add a message
    resp.message("Moving Marker")

    return str(resp)

@app.route("/direction", methods=['GET'])
def get_dir():
    global use
    if use == True:
        use = False
        return current
    else:
        return "waiting"


if __name__ == "__main__":
    port = 5000
    public_url = ngrok.connect(port).public_url
    print(" * ngrok tunnel \"{}\" -> \"http://127.0.0.1:{}\"".format(public_url, port))
    app.config["BASE_URL"] = public_url
    app.run(debug=True)
