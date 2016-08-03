
var config = {
  baseUrl:"http://www.reddit.com",
  affixUrl: "/new/.json?jsonp=?",
  classes: {
    loader: 'loader'
  },
  searchTimeout: 1000
}

var timer = null;
var ImageContainer = React.createClass({
  getInitialState: function() {
    return {images: []};
  },
  componentWillMount: function() {
    console.log("Imagelist:componentWillMount");
  },
  componentWillUpdate: function() {
    console.log("Imagelist:componentWillUpdate");
  },
  componentDidMount: function() {
    console.log("Imagecontainer:componentDidMount");
    var $container = $(".image-container");
    var errorHandler = function() {
      $(".image-container").removeClass(config.classes.loader);
      this.setState({images: []});
      console.log("An error occured while fetching reddit");
    }.bind(this);

    var fn = function() {
      $container.addClass(config.classes.loader);
      var subreddit = $(".search-input").val();
      var url = config.baseUrl + subreddit + config.affixUrl;
      this.request = $.getJSON(url, function(data) {
        this.setState({
          images: data.data.children
        });
        $container.removeClass(config.classes.loader);
        console.log("JSON response:" + this.state.images);
      }.bind(this)).error(errorHandler).fail(errorHandler);
    }.bind(this);

    $(".search-input").keyup(function(event) {
      if(timer) { clearTimeout(timer) }
      timer = setTimeout(fn, config.searchTimeout);
    });
    fn();
  },
  componentWillUnmount: function() {
    $(".search-input").off();
    this.request.abort();
  },
  render: function() {
    console.log("Imagecontainer:render");
    return (
      <div className="image-container">
        <Imagelist images={this.state.images} />
      </div>
    );
  }
})

var Image = React.createClass({
  render: function() {
    return (
      <div className="image">
        <img className="img" src={this.props.src} />
      </div>
    )
  }
});

var Imagelist = React.createClass({
  render: function() {
    var imageNodes = this.props.images.map(function(image) {
      var url;
      if (image.data.preview && image.data.preview.images) {
        url = image.data.preview.images[0].source.url;
      } else { 
        url = "http://pre11.deviantart.net/0e0f/th/pre/f/2010/189/d/f/trollface_by_deniskapwnz.png";
      }
      return (
        <div key={image.data.id} className="title-image">
          <span className="title">{image.data.title}</span>
          <Image src={url} />
        </div>
      )
    });
    return (
      <div className="image-list">
        {imageNodes}
      </div>
    )
  }
});

ReactDOM.render(
  <ImageContainer />, document.getElementById("images")
)
