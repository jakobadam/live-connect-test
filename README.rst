live-connect-test
========

live-connect-test is a test suite that tests browsers' JavaScript-Java
interaction, known as `LiveConnect
<http://en.wikipedia.org/wiki/LiveConnect>`_.

Test results for most mayor browsers and OSes are available at `applets-missing-information-about-liveconnect-and-deployment
<http://www.cabo.dk/blog/copy_of_jakobs-blog/applets-missing-information-about-liveconnect-and-deployment>`_. The
tests show that applets using LiveConnect must avoid parsing complex
objects back and forth and using call in order to be cross-browser
compatible.

The test itself is available at `jdams.org
<http://jdams.org/live-connect-test/>`_.

Running locally
===============

To run locally you must have the following:

 * Python 2.5+

  $ make runserver

  Point browser to localhost:8000

