import { QuoteItem, QuoteLength } from '@/types';

export const COMMON_WORDS = [
  'the', 'be', 'of', 'and', 'a', 'to', 'in', 'he', 'have', 'it', 'that', 'for', 'they', 'I', 'with', 'as',
  'not', 'on', 'she', 'at', 'by', 'this', 'we', 'you', 'do', 'but', 'his', 'from', 'they', 'say', 'her',
  'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out',
  'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just',
  'him', 'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
  'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use',
  'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these',
  'give', 'day', 'most', 'us', 'great', 'between', 'need', 'large', 'under', 'might', 'still', 'must',
  'right', 'program', 'system', 'hand', 'change', 'code', 'small', 'number', 'always', 'move', 'point',
  'world', 'area', 'money', 'water', 'different', 'group', 'problem', 'begin', 'start', 'course', 'side',
  'head', 'stand', 'house', 'power', 'country', 'help', 'school', 'light', 'form', 'show', 'keep', 'eye',
  'never', 'last', 'let', 'thought', 'city', 'tree', 'cross', 'farm', 'hard', 'story', 'saw', 'far',
  'sea', 'draw', 'left', 'late', 'run', 'while', 'press', 'close', 'night', 'real', 'life', 'few', 'north',
  'open', 'seem', 'together', 'next', 'white', 'children', 'begin', 'got', 'walk', 'example', 'ease',
  'paper', 'group', 'always', 'music', 'those', 'both', 'mark', 'often', 'letter', 'until', 'mile', 'river',
  'car', 'feet', 'care', 'second', 'book', 'carry', 'took', 'science', 'eat', 'room', 'friend', 'began',
  'idea', 'fish', 'mountain', 'stop', 'once', 'base', 'hear', 'horse', 'cut', 'sure', 'watch', 'color',
  'face', 'wood', 'main', 'enough', 'plain', 'girl', 'usual', 'young', 'ready', 'above', 'ever', 'red',
  'list', 'though', 'feel', 'talk', 'bird', 'soon', 'body', 'dog', 'family', 'direct', 'pose', 'leave',
  'song', 'measure', 'door', 'product', 'black', 'short', 'numeral', 'class', 'wind', 'question', 'happen',
  'complete', 'ship', 'area', 'half', 'rock', 'order', 'fire', 'south', 'problem', 'piece', 'told', 'knew',
  'pass', 'since', 'top', 'whole', 'king', 'street', 'inch', 'multiply', 'nothing', 'course', 'stay', 'wheel',
  'full', 'force', 'blue', 'object', 'decide', 'surface', 'deep', 'moon', 'island', 'foot', 'system', 'busy',
  'test', 'record', 'boat', 'common', 'gold', 'possible', 'plane', 'stead', 'dry', 'wonder', 'laugh', 'thousand',
  'ago', 'ran', 'check', 'game', 'shape', 'equate', 'hot', 'miss', 'brought', 'heat', 'snow', 'tire', 'bring',
  'yes', 'distant', 'fill', 'east', 'paint', 'language', 'among', 'unit', 'power', 'town', 'fine', 'certain',
  'fly', 'fall', 'lead', 'cry', 'dark', 'machine', 'note', 'wait', 'plan', 'figure', 'star', 'box', 'noun',
  'field', 'rest', 'correct', 'able', 'pound', 'done', 'beauty', 'drive', 'stood', 'contain', 'front', 'teach',
  'week', 'final', 'gave', 'green', 'oh', 'quick', 'develop', 'ocean', 'warm', 'free', 'minute', 'strong',
  'special', 'mind', 'behind', 'clear', 'tail', 'produce', 'fact', 'space', 'heard', 'best', 'hour', 'better',
  'true', 'during', 'hundred', 'five', 'remember', 'step', 'early', 'hold', 'west', 'ground', 'interest',
  'reach', 'fast', 'verb', 'sing', 'listen', 'six', 'table', 'travel', 'less', 'morning', 'ten', 'simple',
  'several', 'vowel', 'toward', 'war', 'lay', 'against', 'pattern', 'slow', 'center', 'love', 'person',
  'money', 'serve', 'appear', 'road', 'map', 'rain', 'rule', 'govern', 'pull', 'cold', 'notice', 'voice',
  'energy', 'hunt', 'probable', 'bed', 'brother', 'egg', 'ride', 'cell', 'believe', 'perhaps', 'pick', 'sudden',
  'count', 'square', 'reason', 'length', 'represent', 'art', 'subject', 'region', 'size', 'vary', 'settle',
  'speak', 'weight', 'general', 'ice', 'matter', 'circle', 'pair', 'include', 'divide', 'syllable', 'felt',
  'grand', 'ball', 'yet', 'wave', 'drop', 'heart', 'am', 'present', 'heavy', 'dance', 'engine', 'position',
  'arm', 'wide', 'sail', 'material', 'fraction', 'forest', 'sit', 'race', 'window', 'store', 'summer', 'train',
  'sleep', 'prove', 'lone', 'leg', 'exercise', 'wall', 'catch', 'mount', 'wish', 'sky', 'board', 'joy',
  'winter', 'sat', 'written', 'wild', 'instrument', 'kept', 'glass', 'grass', 'cow', 'job', 'edge', 'sign',
  'visit', 'past', 'soft', 'fun', 'bright', 'gas', 'weather', 'month', 'million', 'bear', 'finish', 'happy',
  'hope', 'flower', 'clothe', 'strange', 'gone', 'jump', 'baby', 'eight', 'village', 'meet', 'root', 'buy',
  'raise', 'solve', 'metal', 'whether', 'push', 'seven', 'paragraph', 'third', 'shall', 'held', 'hair', 'describe',
  'cook', 'floor', 'either', 'result', 'burn', 'hill', 'safe', 'cat', 'century', 'consider', 'type', 'law',
  'bit', 'coast', 'copy', 'phrase', 'silent', 'tall', 'sand', 'soil', 'roll', 'temperature', 'finger', 'industry',
  'value', 'fight', 'lie', 'beat', 'excite', 'natural', 'view', 'sense', 'ear', 'else', 'quite', 'broke',
  'case', 'middle', 'kill', 'son', 'lake', 'moment', 'scale', 'loud', 'spring', 'observe', 'child', 'straight',
  'consonant', 'nation', 'dictionary', 'milk', 'speed', 'method', 'organ', 'pay', 'age', 'section', 'dress',
  'cloud', 'surprise', 'quiet', 'stone', 'tiny', 'climb', 'cool', 'design', 'poor', 'lot', 'experiment', 'bottom',
  'key', 'iron', 'single', 'stick', 'flat', 'twenty', 'skin', 'smile', 'crease', 'hole', 'trade', 'melody',
  'trip', 'office', 'receive', 'row', 'mouth', 'exact', 'symbol', 'die', 'least', 'trouble', 'shout', 'except',
  'wrote', 'seed', 'tone', 'join', 'suggest', 'clean', 'break', 'lady', 'yard', 'rise', 'bad', 'blow',
  'oil', 'blood', 'touch', 'grew', 'cent', 'mix', 'team', 'wire', 'cost', 'lost', 'brown', 'wear',
  'garden', 'equal', 'sent', 'choose', 'fell', 'fit', 'flow', 'fair', 'bank', 'collect', 'save', 'control',
  'decimal', 'gentle', 'woman', 'captain', 'practice', 'separate', 'difficult', 'doctor', 'please', 'protect',
  'noon', 'whose', 'locate', 'ring', 'character', 'insect', 'caught', 'period', 'indicate', 'radio', 'spoke',
  'atom', 'human', 'history', 'effect', 'electric', 'expect', 'crop', 'modern', 'element', 'hit', 'student',
  'corner', 'party', 'supply', 'bone', 'rail', 'imagine', 'provide', 'agree', 'thus', 'capital', 'chair',
  'danger', 'fruit', 'rich', 'thick', 'soldier', 'process', 'operate', 'guess', 'necessary', 'sharp', 'wing',
  'create', 'neighbor', 'wash', 'bat', 'rather', 'crowd', 'corn', 'compare', 'poem', 'string', 'bell', 'depend',
  'meat', 'rub', 'tube', 'famous', 'dollar', 'stream', 'fear', 'sight', 'thin', 'triangle', 'planet', 'hurry',
  'chief', 'colony', 'clock', 'mine', 'tie', 'enter', 'major', 'fresh', 'search', 'send', 'yellow', 'gun',
  'allow', 'print', 'dead', 'spot', 'desert', 'suit', 'current', 'lift', 'rose', 'continue', 'block', 'chart',
  'hat', 'sell', 'success', 'company', 'subtract', 'event', 'particular', 'deal', 'swim', 'term', 'opposite',
  'wife', 'shoe', 'shoulder', 'spread', 'arrange', 'camp', 'invent', 'cotton', 'born', 'determine', 'quart',
  'nine', 'truck', 'noise', 'level', 'chance', 'gather', 'shop', 'stretch', 'throw', 'shine', 'property',
  'column', 'molecule', 'select', 'wrong', 'gray', 'repeat', 'require', 'broad', 'prepare', 'salt', 'nose',
  'plural', 'anger', 'claim', 'continent', 'oxygen', 'sugar', 'death', 'pretty', 'skill', 'women', 'season',
  'solution', 'magnet', 'silver', 'thank', 'branch', 'match', 'suffix', 'especially', 'fig', 'afraid', 'huge',
  'sister', 'steel', 'discuss', 'forward', 'similar', 'guide', 'experience', 'score', 'apple', 'bought', 'led',
  'pitch', 'coat', 'mass', 'card', 'band', 'rope', 'slip', 'win', 'dream', 'evening', 'condition', 'feed',
  'tool', 'total', 'basic', 'smell', 'valley', 'nor', 'double', 'seat', 'arrive', 'master', 'track', 'parent',
  'shore', 'division', 'sheet', 'substance', 'favor', 'connect', 'post', 'spend', 'chord', 'fat', 'glad',
  'original', 'share', 'station', 'dad', 'bread', 'charge', 'proper', 'bar', 'offer', 'segment', 'slave',
  'duck', 'instant', 'market', 'degree', 'populate', 'chick', 'dear', 'enemy', 'reply', 'drink', 'occur',
  'support', 'speech', 'nature', 'range', 'steam', 'motion', 'path', 'liquid', 'log', 'meant', 'quotient',
  'teeth', 'shell', 'neck'
];

export const QUOTES: QuoteItem[] = [
  {
    id: 1,
    text: "Simplicity is prerequisite for reliability.",
    source: "Edsger W. Dijkstra",
    length: "short"
  },
  {
    id: 2,
    text: "Programs must be written for people to read, and only incidentally for machines to execute.",
    source: "Harold Abelson",
    length: "medium"
  },
  {
    id: 3,
    text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    source: "Martin Fowler",
    length: "medium"
  },
  {
    id: 4,
    text: "First, solve the problem. Then, write the code.",
    source: "John Johnson",
    length: "short"
  },
  {
    id: 5,
    text: "Experience is the name everyone gives to their mistakes.",
    source: "Oscar Wilde",
    length: "short"
  },
  {
    id: 6,
    text: "In order to be irreplaceable, one must always be different.",
    source: "Coco Chanel",
    length: "short"
  },
  {
    id: 7,
    text: "Knowledge is power. Information is liberating. Education is the premise of progress, in every society, in every family.",
    source: "Kofi Annan",
    length: "medium"
  },
  {
    id: 8,
    text: "Software is a great combination between artistry and engineering. When you finally see the code running cleanly and the user smiling, all the late nights become worthwhile.",
    source: "Bill Gates",
    length: "long"
  },
  {
    id: 9,
    text: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
    source: "Nelson Mandela",
    length: "medium"
  },
  {
    id: 10,
    text: "The future belongs to those who believe in the beauty of their dreams.",
    source: "Eleanor Roosevelt",
    length: "short"
  }
];

export function getRandomWords(count: number, punctuation = false, numbers = false): string[] {
  const result: string[] = [];
  const punctuationMarks = ['.', ',', ';', '!', '?', '-', '"'];

  for (let i = 0; i < count; i++) {
    let word = COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)];

    if (numbers && Math.random() < 0.15) {
      word = Math.floor(Math.random() * 900 + 10).toString();
    } else {
      if (punctuation && Math.random() < 0.25) {
        if (Math.random() < 0.4) {
          word = word.charAt(0).toUpperCase() + word.slice(1);
        }
        const mark = punctuationMarks[Math.floor(Math.random() * punctuationMarks.length)];
        if (mark === '"') {
          word = `"${word}"`;
        } else {
          word = `${word}${mark}`;
        }
      }
    }
    result.push(word);
  }
  return result;
}

export function getRandomQuote(length?: QuoteLength): QuoteItem {
  const filtered = length ? QUOTES.filter((q) => q.length === length) : QUOTES;
  const list = filtered.length > 0 ? filtered : QUOTES;
  return list[Math.floor(Math.random() * list.length)];
}
