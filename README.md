6th CSS Sense
=============

*I see dead CSS selectors.*

Drop **6cs.js** and **6cs.css** into your web application. Probably you'll only
want to do this in dev environments; so e.g. for Rails you could have something
like this in your application layout:

```erb
<% if Rails.env.development? -%>
  <%= stylesheet_link_tag("6cs") %>
  <%= javascript_include_tag("6cs") %>
<% end -%>
```

Then when you load a page, the script will scan all CSS rules in all stylesheets
and figure out which ones aren't being used, then display a list of these dead
rules in a little panel at the bottom of the page. It will recheck every so
often (currently 3 seconds) and continuously update the list, to account for
selectors being added dynamically via JavaScript.

I'm sure stuff like this exists already, but I wasn't aware of any particularly
well-known solution.

This does differ from the project [deadweight](https://github.com/aanand/deadweight)
(I think) in that it scans a **live page**, to account for CSS that may not be
applicable to static HTML but does actually get used due to the interaction
between JavaScript and the DOM.

This makes it particularly useful for so-called "single-page" apps, where you
might have one (e.g., concatenated) stylesheet that applies to potentially many
different HTML files, and includes transitions and other such things that you
wouldn't see in action by looking at the HTML itself.

So load up your page, click around for a while, and see how much dead CSS you
can find!
