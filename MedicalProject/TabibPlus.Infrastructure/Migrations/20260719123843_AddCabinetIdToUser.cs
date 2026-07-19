using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TabibPlus.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCabinetIdToUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CabinetId",
                table: "Users",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_CabinetId",
                table: "Users",
                column: "CabinetId");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Cabinets_CabinetId",
                table: "Users",
                column: "CabinetId",
                principalTable: "Cabinets",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_Cabinets_CabinetId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_CabinetId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "CabinetId",
                table: "Users");
        }
    }
}
