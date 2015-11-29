## Website Performance Optimization portfolio project

The original project that is optimized here can be found at [Udacity's github](https://github.com/udacity/frontend-nanodegree-mobile-portfolio).

This project aims to optimize the online portfolio for speed! In particular, optimize the critical rendering path and make this page render as quickly as possible by applying the techniques we've picked up in the [Critical Rendering Path course](https://www.udacity.com/course/ud884).


### Getting Started

Some useful tips to help you get started:

1. Check out the repository
1. To inspect the site on your phone, you can run a local srver

  ```bash
  $> cd /path/to/your-project-folder
  $> python -m SimpleHTTPServer 8080
  ```

1. Open a browser and visit localhost:8080
1. Download and install [ngrok](https://ngrok.com/) to make your local server accessible remotely.

  ``` bash
  $> cd /path/to/your-project-folder
  $> ngrok http 8080
  ```

1. Copy the public URL ngrok gives you and try running it through [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/)!

### Directory Structure

I have changed the directory structure of the project to make it more structured and make running of grunt tasks easier.

1. All HTML files that the developer will modify is stored in the `src/` folder. DO NOT modify the html files at the root of the project for they are the final optimized html outputs.
1. All image files are stored in the `img/` directory, images stored here are already optimized.
1. All CSS files are stored in the `css/` directory. The minified CSS files are also stored in this directory.
1. All JS files are stored in the `js/` directory. The minified JS files are also stored in this directory.

### Optimizations

#### Part 1: Optimize PageSpeed Insights score for index.html

Here is the list of optimizations I did to achieve a PageSpeed Score of greater than 90

1. Minified the CSS and JS used in this portfolio. To do that, I used grunt to automatically generate minified version of CSS and JS everytime I change any of these files.
1. Added `media="print"` to the `print.min.css` link tag.
1. Inlined the `style.min.css` using grunt `inline` task. The minified CSS is now part of the HTML so no need to send another browser request for style.min.css, thus, less loading time.
1. Added async tag to the google's `analytics.js` and `perfmatters.min.js`. The scripts are moved at the end of the body of html.
1. Resized the whooping 2048 x 1536px `pizzeria.jpg` to 100 x 60 px `pizzeria-thumb.jpg` to reduce the image size by 2.2MB.
1. Optimized the `profilepic.jpg` using an online image optimizer to reduce at least 10KB.
1. Removed extra spaces in the html by using the grunt `htmlmin` module.

#### Part 2: Optimize Frames per Second in pizza.html

Here is the list of optimizations I did to achieve less than 60 frames per second for the pizza.html page.

1. Created the `loadMovingPizzas` function to compute the number of moving pizzas that are visible on the screen depending on the browser's window size. This function only generates the number of visible pizzas, compared to the previous implementation which generates fixed 200 pizzas. It reduces the number of elements that are updated when calling the `updatePositions` function which sets the left position of all moving pizza element.
1. All `document.querySelector` and `document.querySelectorAll` are replaced with `document.getElementById` and `document.getElementsByTagName` to make accessing the DOM faster.
1. Used `transform: translate3d(x,y,z)` property instead of `left` and `top` property to optimize the layout computation and rendering time. To do this, I first set all the `top` and `left` property of the `.mover` elements to `0` in the pizza.css, then I used translate3d to set their x and y positions in the JS code when the scroll event is fired.
1. Optimized the for loops by moving out DOM query selectors outside the loop. We can see in the [original code](https://github.com/udacity/frontend-nanodegree-mobile-portfolio/blob/master/views/js/main.js#L452) in the `changePizzaSizes` function, that it calls the `document.querySelectorAll(".randomPizzaContainer")` four times inside the for loop. This is not a good idea. So I refactored it by setting the result of `document.getElementsByClassName("randomPizzaContainer")` to a variable first, then just accessing this variable inside the loop.
1. Optimized the for loops by moving out the statements that don't need to be inside the loop. One example is the computation of phase in the `updatePositions` function. A `Math.sin()` function generates repeating values, in our case, it is only generating 5 unique values. So the formula computation for this 5 unique values are moved outside the main loop.
1. Minified the `pizza.js`
1. Combined the `bootstrap-grid.css` and `pizza.css`, removed the unused CSS styles, minified it to `pizza.tidy.min.css` and put it inline the HTML.  All these are done using grunt tasks.
1. Resized the `pizzeria.jpg` image from 2048 x 1536 px to 720 x 540 px which is the maximum size the image will be resized based on the CSS styles. After resizing, `pizzeria.jpg` and `pizza.png` are optimized using an online image optimizer.
1. Removed extra spaces in the `pizza.html` by using the grunt `htmlmin` module.