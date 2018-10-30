import dev from '@/config/dev.env';
import prod from '@/config/prod.env';

export default {
  API_ROOT: process.env.NODE_ENV === 'development'
    ? dev.API_ROOT
    : prod.API_ROOT
};
