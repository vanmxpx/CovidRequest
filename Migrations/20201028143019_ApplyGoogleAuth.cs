using Microsoft.EntityFrameworkCore.Migrations;

namespace CovidRequest.Migrations
{
    public partial class ApplyGoogleAuth : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "EmailVerified",
                table: "Credentials",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "PhoneVerified",
                table: "Credentials",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "Provider",
                table: "Credentials",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EmailVerified",
                table: "Credentials");

            migrationBuilder.DropColumn(
                name: "PhoneVerified",
                table: "Credentials");

            migrationBuilder.DropColumn(
                name: "Provider",
                table: "Credentials");
        }
    }
}
