export default {
  signUp: {
    username: {
      required: true,
      type: 'string',
      min: 3,
      max: 20
    },
    password: {
      required: true,
      type: 'string',
      min: 3,
      max: 20
    },
    type: ['1', '2']
  },
  signIn: {
    username: {
      required: true,
      type: 'string',
      min: 3,
      max: 20
    },
    password: {
      required: true,
      type: 'string',
      min: 3,
      max: 20
    }
  }
};

