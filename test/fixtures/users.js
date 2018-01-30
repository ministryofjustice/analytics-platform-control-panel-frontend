module.exports = {
  count: 2,
  next: null,
  previous: null,
  results: [
    {
      auth0_id: 'github|1',
      url: `http://localhost:8000/users/${escape('github|1')}`,
      username: 'johndoe',
      name: 'John Doe',
      email: 'john.doe@example.com',
      groups: [],
    },
    {
      auth0_id: 'github|2',
      url: `http://localhost:8000/users/${escape('github|2')}`,
      username: 'Mario Rossi',
      name: 'Mario Rossi',
      email: 'mario.rossi@example.com',
      groups: [],
    },
  ],
};
