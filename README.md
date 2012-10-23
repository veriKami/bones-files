bones-files
===========

Provides file upload and download capabilities to [Bones](https://github.com/developmentseed/bones).

When a file is uploaded, it will be stored in `req.session` as a `File` model, from where you can extend/augment.

If a file with the same filename exists, the uploaded file will get an incremental counter appended to its filename.

Read [the Bones wiki](https://github.com/developmentseed/bones/wiki/Plugin-Architecture) for more information on Bones plugin architecture.

### Usage
Files are uploaded by doing a `POST` to the `/upload` URL.

    <form action="/upload" method="post" enctype="multipart/form-data">
        <input type="file" />
    </form>

Files are downloading by doing a `GET` from the `/download` URL.

    <a href="/download/example.txt">Download</a>

By default, files are stored in the `/files` directory, which you will need to create in your application.

### Commands
* `--uploadDir`: Directory to where files are uploaded. Defaults to `/files`
* `--downloadDir`: Directory from where files are downloaded. Defaults to `/files`

### Authors
* [Victor Kareh](http://github.com/vkareh)

### License

(The MIT License)

Copyright (C) 2012 Victor Kareh

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
