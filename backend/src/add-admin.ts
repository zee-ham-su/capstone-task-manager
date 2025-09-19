import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  const email = process.argv[2];
  if (!email) {
    console.error('Please provide an email address.');
    process.exit(1);
  }

  const user = await usersService.findByEmail(email);
  if (!user) {
    console.error(`User with email ${email} not found.`);
    process.exit(1);
  }

  if (user.roles.includes('admin')) {
    console.log(`User ${email} is already an admin.`);
    await app.close();
    return;
  }

  user.roles.push('admin');
  await user.save();

  console.log(`User ${email} has been granted admin privileges.`);
  await app.close();
}

bootstrap();
