describe('Auth e2e', () => {
  let app: INestApplication;
  let databaseService: DatabaseService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const PORT = 3002;
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // Only DTO fields are allowed.
      }),
    );
    await app.init();
    await app.listen(PORT);

    databaseService = app.get(DatabaseService);
    await databaseService.cleanDbInOrder();

    pactum.request.setBaseUrl(`http://localhost:${PORT}`);
  });

  afterAll(async () => {
    // Closes database connection too.
    await app.close();
  });
});
