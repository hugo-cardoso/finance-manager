import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { SupabaseProvider } from "@src/supabase/supabase.provider";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.SUPABASE_JWT_SECRET!,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, SupabaseProvider],
})
export class AuthModule {}
