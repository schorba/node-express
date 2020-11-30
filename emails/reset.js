const keys = require('../keys');
module.exports = function (email, token) {
  return {
    to: email,
    from: keys.EMAIL_FROM,
    subject: 'Reset Password',
    html: `
<h1>
  Reset Password ?
</h1>
<p>
  If no, please ignore this Email
</p>
<p>
  Else - click the link below:
</p>
<p>
  <a href='${keys.BASE_URL}/auth/password/${token}'>
    Reset Password
  </a>
</p>
<hr />
<a href='${keys.BASE_URL}'>
  Go to Shop
</a>
`,
  };
};
