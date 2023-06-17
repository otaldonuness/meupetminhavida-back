describe('Auth', () => {
  const signUpDto: SignUpAuthDto = {
    email: 'test@gmail.com',
    password: 'test123',
    firstName: 'Test',
    lastName: 'Test',
  };
  const signInDto: SignInAuthDto = {
    email: signUpDto.email,
    password: signUpDto.password,
  };

  describe('Signup', () => {
    it('should throw if email empty', () => {
      return pactum
        .spec()
        .post('/auth/signup')
        .withJson({
          password: signUpDto.password,
        })
        .expectStatus(HttpStatus.BAD_REQUEST);
    });

    it('should throw if password empty', () => {
      return pactum
        .spec()
        .post('/auth/signup')
        .withJson({
          email: signUpDto.email,
        })
        .expectStatus(HttpStatus.BAD_REQUEST);
    });

    it('should throw if no body', () => {
      return pactum.spec().post('/auth/signup').expectStatus(HttpStatus.BAD_REQUEST);
    });

    it('should signup', async () => {
      return pactum
        .spec()
        .post('/auth/signup')
        .withJson(signUpDto)
        .expectStatus(HttpStatus.CREATED);
    });
  });

  describe('Signin', () => {
    it('should throw if email empty', () => {
      return pactum
        .spec()
        .post('/auth/signin')
        .withJson({
          password: signInDto.password,
        })
        .expectStatus(HttpStatus.BAD_REQUEST);
    });

    it('should throw if password empty', () => {
      return pactum
        .spec()
        .post('/auth/signin')
        .withJson({
          email: signInDto.email,
        })
        .expectStatus(HttpStatus.BAD_REQUEST);
    });

    it('should throw if no body', () => {
      return pactum.spec().post('/auth/signin').expectStatus(HttpStatus.BAD_REQUEST);
    });

    it('should signin', async () => {
      return pactum
        .spec()
        .post('/auth/signin')
        .withJson(signInDto)
        .expectStatus(HttpStatus.OK)
        .stores('userAt', 'access_token');
    });
  });
});
