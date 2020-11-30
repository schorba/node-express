const e = require('express');
const keys = require('../keys');

module.exports = function (email) {
  return {
    to: email,
    from: keys.EMAIL_FROM,
    subject: 'Node Shop Registration',
    html: `
<h1>
  Welcome to the shop
</h1>
<p>
  Your account ${email} has been created
</p>
<hr />
<a href='${keys.BASE_URL}'>
  Go to Shop
</a>
`,
  };
};
