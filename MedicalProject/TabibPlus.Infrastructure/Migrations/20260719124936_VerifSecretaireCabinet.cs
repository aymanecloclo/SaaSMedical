using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TabibPlus.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class VerifSecretaireCabinet : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_Cabinets_CabinetId",
                table: "Users");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Cabinets_CabinetId",
                table: "Users",
                column: "CabinetId",
                principalTable: "Cabinets",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_Cabinets_CabinetId",
                table: "Users");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Cabinets_CabinetId",
                table: "Users",
                column: "CabinetId",
                principalTable: "Cabinets",
                principalColumn: "Id");
        }
    }
}
