using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace CovidRequest.Migrations
{
    public partial class Payments : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FatherName",
                table: "Profiles",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Phone",
                table: "Credentials",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "Credentials",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<long>(
                name: "AccountingRef",
                table: "Credentials",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.CreateTable(
                name: "Accountings",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RequestsLeft = table.Column<int>(nullable: false),
                    Subscription = table.Column<int>(nullable: false),
                    CreatedAt = table.Column<DateTime>(nullable: false),
                    ModifiedAt = table.Column<DateTime>(nullable: false),
                    CreatedBy = table.Column<long>(nullable: false),
                    ModifiedBy = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Accountings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Payments",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PaymentStatus = table.Column<int>(nullable: false),
                    Amount = table.Column<long>(nullable: false),
                    PaymentMethodRef = table.Column<long>(nullable: false),
                    ReceiptId = table.Column<string>(nullable: true),
                    RequestsReceived = table.Column<long>(nullable: false),
                    CreatedAt = table.Column<DateTime>(nullable: false),
                    CreatedBy = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Payments", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Credentials_Email_Phone",
                table: "Credentials",
                columns: new[] { "Email", "Phone" },
                unique: true,
                filter: "[Email] IS NOT NULL AND [Phone] IS NOT NULL");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Accountings");

            migrationBuilder.DropTable(
                name: "Payments");

            migrationBuilder.DropIndex(
                name: "IX_Credentials_Email_Phone",
                table: "Credentials");

            migrationBuilder.DropColumn(
                name: "FatherName",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "AccountingRef",
                table: "Credentials");

            migrationBuilder.AlterColumn<string>(
                name: "Phone",
                table: "Credentials",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "Credentials",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);
        }
    }
}
