# Rich Text

User story: As a user I want to be able to create formatted content for my posts.

I have used TinyMce before for this purpose.  However, I saw the [ReactQuill Editor] editor used in the [WatchForum](https://github.com/Karlox01/WatchForum) project and it seemed like a really simple solution.

There are two parts to allowing rich text in a post.

One is the editor itself using ReactQuill.  The other is displaying the result of the editor using the react-html-parser package.

## A rich text editor

The content saved by the rich text editor would be a string with markup in it like this:

```html
<p>
  <span style="color: rgb(0, 0, 0)"
    >The watch that Anant Ambani, Mukesh Ambani’s younger son, wore at his
    pre-wedding festivities in Gujarat’s Jamnagar on Saturday, impressed Mark
    Zuckerberg and his wife Priscilla Chan so much that they raved about the
    luxury piece.</span
  >
</p>
<p><br /></p>
<p>
  <span style="color: rgb(0, 0, 0)"
    >I wasn't able to fund out any details about the watch except that it news
    reports say "</span
  ><span style="color: rgb(88, 88, 88)"
    >The luxury watch costs a whopping $1 million</span
  ><span style="color: rgb(0, 0, 0)">".</span>
</p>
```

## Displaying rich text

The npm library [react-html-parser](https://github.com/peternewnham/react-html-parser) is used to display the markup content.

```sh
npm install react-html-parser
```

I had an error due to a dependency conflict in your project. The package react-html-parser has a peer dependency on an older version of React, while your project is using React v17.0.2.

To resolve this issue, I use teh legacy peer dep flag:

```sh
npm install react-html-parser@2.0.2 --legacy-peer-deps
```

Then, on the Post.js page, all you need to do is import tha component and use it there:

```js
{content && <Card.Text>{ReactHtmlParser(content)}</Card.Text>}
```

This works to allow markup content in the post.  However, when I go to edit the post, I see this error and the app redirects back to the main page:

```err
Warning: validateDOMNesting(...): <p> cannot appear as a descendant of <p>.
    at p
    at p
    at http://localhost:3000/static/js/vendors~main.chunk.js:15580:27
    at div
    at http://localhost:3000/static/js/vendors~main.chunk.js:15580:27
    at div
    at http://localhost:3000/static/js/vendors~main.chunk.js:12516:23
    at Post (http://localhost:3000/static/js/main.chunk.js:4306:5)
    at div
    at http://localhost:3000/static/js/vendors~main.chunk.js:12700:23
    at div
    at http://localhost:3000/static/js/vendors~main.chunk.js:15151:23
    at PostPage (http://localhost:3000/static/js/main.chunk.js:5475:69)
```

## ReactQuill editor

Using the React Quill rich text editor took a little bit of time to get set up.

Installing [the library](https://www.npmjs.com/package/react-quill) seems to have a compatibility issue:

```sh
$ npm install react-quill --save
npm ERR! code ERESOLVE
npm ERR! ERESOLVE could not resolve
npm ERR! 
npm ERR! While resolving: react-html-parser@2.0.2
npm ERR! Found: react@17.0.2
npm ERR! node_modules/react
npm ERR!   peer react@">=16.3.2" from @restart/context@2.1.4
npm ERR!   node_modules/@restart/context
npm ERR!     @restart/context@"^2.1.4" from react-bootstrap@1.6.3
npm ERR!     node_modules/react-bootstrap
npm ERR!       react-bootstrap@"^1.6.3" from the root project
npm ERR!   peer react@">=16.8.0" from @restart/hooks@0.4.9
npm ERR!   node_modules/@restart/hooks
npm ERR!     @restart/hooks@"^0.4.7" from react-overlays@5.2.1
npm ERR!     node_modules/react-overlays
npm ERR!       react-overlays@"^5.1.1" from react-bootstrap@1.6.3
npm ERR!       node_modules/react-bootstrap
npm ERR!         react-bootstrap@"^1.6.3" from the root project
npm ERR!   15 more (@testing-library/react, mini-create-react-context, ...)
npm ERR! 
npm ERR! Could not resolve dependency:
npm ERR! peer react@"^0.14.0 || ^15.0.0 || ^16.0.0-0" from react-html-parser@2.0.2
npm ERR! node_modules/react-html-parser
npm ERR!   react-html-parser@"^2.0.2" from the root project
npm ERR!
npm ERR! Conflicting peer dependency: react@16.14.0
npm ERR! node_modules/react
npm ERR!   peer react@"^0.14.0 || ^15.0.0 || ^16.0.0-0" from react-html-parser@2.0.2
npm ERR!   node_modules/react-html-parser
npm ERR!     react-html-parser@"^2.0.2" from the root project
npm ERR!
npm ERR! Fix the upstream dependency conflict, or retry
npm ERR! this command with --force, or --legacy-peer-deps
npm ERR! to accept an incorrect (and potentially broken) dependency resolution.
npm ERR!
npm ERR! See C:\Users\timof\AppData\Local\npm-cache\eresolve-report.txt for a full report.
```

The current version is "react-quill": "^2.0.0", which is supposed to work for React 16+

Trying again with the ```--legacy-peer-deps``` flag.

Maybe the legacy flag was not such a good idea, as now I am seeing this warning when trying to use the space bar in the edit input:

```err
addRange(): The given range isn't in document. (quill.js line 3195: selection.addRange(range))
    setNativeRange
    (anonymous)
    ...
```

It only happens at the end of the content, not being able to add a space.  I can see that the handleChange() function is being called twice.  Once with the space at the end, and once again without.

There is a long [GitHub issue](https://github.com/quilljs/quill/issues/1940) open since about 2018 for this error with various suggestions.

The solution is this:

```js
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
...
  const handleChange = (value) => {
     setPostData((prevData) => ({
      ...prevData,
      content: value,
    }));
  };
...
          <ReactQuill
            className={appStyles.quill}
            value={content}
            preserveWhitespace={true}
            onChange={(value) => handleChange(value)}
          />
```
