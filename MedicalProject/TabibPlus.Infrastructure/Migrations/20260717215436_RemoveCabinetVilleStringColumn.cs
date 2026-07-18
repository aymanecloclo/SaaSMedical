using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TabibPlus.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemoveCabinetVilleStringColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cabinets_Villes_VilleId",
                table: "Cabinets");

            migrationBuilder.DropColumn(
                name: "Ville",
                table: "Cabinets");

            migrationBuilder.UpdateData(
                table: "Cabinets",
                keyColumn: "Id",
                keyValue: 1,
                column: "VilleId",
                value: 1);

            migrationBuilder.AddForeignKey(
                name: "FK_Cabinets_Villes_VilleId",
                table: "Cabinets",
                column: "VilleId",
                principalTable: "Villes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cabinets_Villes_VilleId",
                table: "Cabinets");

            migrationBuilder.AddColumn<string>(
                name: "Ville",
                table: "Cabinets",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "Cabinets",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Ville", "VilleId" },
                values: new object[] { "Casablanca", null });

            migrationBuilder.AddForeignKey(
                name: "FK_Cabinets_Villes_VilleId",
                table: "Cabinets",
                column: "VilleId",
                principalTable: "Villes",
                principalColumn: "Id");
        }
    }
}
