from flask import Flask, request, render_template, flash, jsonify, session
from boggle import Boggle
from flask_debugtoolbar import DebugToolbarExtension

app = Flask(__name__)
app.config["SECRET_KEY"] = "tastycakes"
debug = DebugToolbarExtension(app)

boggle_game = Boggle()

@app.route('/')
def homepage():
    board = boggle_game.make_board()
    session['board'] = board
    highscore = session.get('highscore', 0)
    nplays = session.get('nplays', 0)
    
    return render_template('index.html', board=board, highscore=highscore, nplays=nplays)

@app.route('/check-word')
def check_word():
    word = request.args.get('word')
    board = session['board']
    response = boggle_game.check_valid_word(board, word)

    return jsonify({'result': response})

@app.route('/post-score', methods=["POST"])
def post_scores():
    score = request.json['score']
    nplays = session.get('nplays', 0)
    highscore = session.get('highscore', 0)

    session['nplays'] = nplays + 1
    session['highscore'] = max(highscore, score)

    return jsonify(newHighScore=score > highscore)
