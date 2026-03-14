import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Order "mo:core/Order";

actor {
  type NewsCategory = {
    #newGame;
    #characterReveal;
    #update;
    #other;
  };

  type NewsArticle = {
    title : Text;
    summary : Text;
    date : Time.Time;
    category : NewsCategory;
  };

  module NewsArticle {
    public func compareByDate(a : NewsArticle, b : NewsArticle) : Order.Order {
      Int.compare(a.date, b.date);
    };
  };

  type HighScore = {
    gameName : Text;
    playerName : Text;
    score : Nat;
  };

  let newsArticles = Map.empty<Text, NewsArticle>();
  let highScores = Map.empty<Text, HighScore>();

  // News Management

  public shared ({ caller }) func addNewsArticle(title : Text, summary : Text, category : NewsCategory) : async () {
    let article : NewsArticle = {
      title;
      summary;
      date = Time.now();
      category;
    };
    newsArticles.add(title, article);
  };

  public shared ({ caller }) func removeNewsArticle(title : Text) : async () {
    if (not newsArticles.containsKey(title)) {
      Runtime.trap("Article does not exist");
    };
    newsArticles.remove(title);
  };

  public query ({ caller }) func getAllNews() : async [NewsArticle] {
    newsArticles.values().toArray().sort(NewsArticle.compareByDate);
  };

  public query ({ caller }) func getNewsByCategory(category : NewsCategory) : async [NewsArticle] {
    newsArticles.values().toArray().filter(
      func(article) {
        article.category == category;
      }
    );
  };

  // High Score Management

  public shared ({ caller }) func addHighScore(gameName : Text, playerName : Text, score : Nat) : async () {
    let entry : HighScore = {
      gameName;
      playerName;
      score;
    };
    let key = gameName.concat("_").concat(playerName);
    highScores.add(key, entry);
  };

  public shared ({ caller }) func removeHighScore(gameName : Text, playerName : Text) : async () {
    let key = gameName.concat("_").concat(playerName);
    if (not highScores.containsKey(key)) {
      Runtime.trap("High score entry does not exist");
    };
    highScores.remove(key);
  };

  public query ({ caller }) func getHighScores(gameName : Text) : async [HighScore] {
    highScores.values().toArray().filter(
      func(entry) {
        entry.gameName == gameName;
      }
    );
  };
};
