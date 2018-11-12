const tokenizer = require('string-tokenizer');
const sw = require('stopword');
class Classifier{
  constructor(){
    this.dictionaries = {};
    this.group_freqency ={};
    this.sample_total = 0;
  }

  tokenization(string){
  // console.log(string);
   let tokenized_array = [];
   let first_clear =[];
   var tokenized_String = tokenizer()
                              .input(string)
                                .token('tag', /#[\w\d-_]+/)
                                .token('url', /(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?/, function(values){ return values[0] })
                                .token('space', /[\s]+/)
                                .token('symbol', /[\w]+/)
                              .resolve();
    // console.log(string);
    if(tokenized_String.symbol != undefined) {
      if(Array.isArray(tokenized_String.symbol) ){
        first_clear = sw.removeStopwords(tokenized_String.symbol);
      }else{
        first_clear.push(tokenized_String.symbol);
      }
    }
    if(first_clear.length != 0){
      for(let i = 0; i<first_clear.length; i++){
        // console.log(first_clear[i]);
        var lower_case = first_clear[i].toLowerCase();
        if(isNaN(lower_case)){
          tokenized_array.push(lower_case);
        }
      }
    }
    return tokenized_array;
  }

  training(text, group){
    var words = this.tokenization(text);
    var group_total = group+"_total";
      this.dictionaries[group] ? "" : this.dictionaries[group] = {};
      this.group_freqency[group_total] ? "" : this.group_freqency[group_total] = 0;
      // var self = this;
      words.map((w) => {
          this.dictionaries[group][w] ? this.dictionaries[group][w]++ : this.dictionaries[group][w] = 1;
          this.group_freqency[group_total]++;
      });

      //get total total number of sample
      this.sample_total = 0;
      for(var i in this.group_freqency){
        this.sample_total += this.group_freqency[i]
      };
  }

  classifiy(text){
    var words = this.tokenization(text);
    var groups = [];
    var probabilities = {};
    var finals = [];
    for (var g in this.dictionaries){groups.push(g)};
    for (var i = 0; i < words.length; i++) {
        //Ignore small words
        // if (words[i].length <= 2) continue;
        var sums = {};
        for (var j = 0; j < groups.length; j++){
          if (!sums[words[i]]) sums[words[i]] = 0;
          if (!this.dictionaries[groups[j]][words[i]]) this.dictionaries[groups[j]][words[i]] = 0;
          sums[words[i]] += this.dictionaries[groups[j]][words[i]];
        }
        //Calculate P(word[i]|groups[j])
        for (var j = 0; j < groups.length; j++){
          var group_total = groups[j]+"_total";
          var Probs_word_group = this.dictionaries[groups[j]][words[i]]/this.group_freqency[group_total];
          var Probs_group = this.group_freqency[group_total]/this.sample_total;
          var Probs_word = sums[words[i]]/this.sample_total;
          var Probs_group_word = 0;
          if(Probs_word != 0){
            Probs_group_word = (Probs_word_group*Probs_group)/Probs_word;
          }
          if(!probabilities[words[i]]){
            probabilities[words[i]] = {};
            probabilities[words[i]][groups[j]] = Probs_group_word;
          }else{
            probabilities[words[i]][groups[j]] = Probs_group_word;
          }
        }
        // console.log(probabilities);
        for (var j = 0; j < groups.length; j++) {
            if (!finals[groups[j]]) finals[groups[j]] = [];
            finals[groups[j]].push(probabilities[words[i]][groups[j]]);
        }

    }

    // console.log(finals);
    for (var i = 0; i < groups.length; i++) {
        finals[groups[i]] = this.average(finals[groups[i]]);
    }
    // console.log(finals);
    var highestGroup = "";
    var highestValue = 0;
    for (var group in finals) {
        if (finals[group] > highestValue) {
            highestGroup = group;
            highestValue = finals[group];
        }
    }
    return highestGroup;
  }

  get_dictionaries(){
    console.log(this.dictionaries);
  }

  average(numbers) {
   var sum = 0;
     for (var i = 0; i < numbers.length; i++) {
         sum += numbers[i];
     }
     return sum / numbers.length;
  }
}

module.exports = Classifier;
