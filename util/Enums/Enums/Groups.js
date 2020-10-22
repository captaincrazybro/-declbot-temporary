module.exports = class Groups {}

const Groups = module.exports;
Groups.DEFAULT = 0;
Groups.MOD = 1;
Groups.ADMIN = 2;
Groups.MANAGER = 3;
Groups.OWNER = 4;

Groups.parse = {
	0: "Default",
	1: "Mod",
	2: "Admin",
	3: "Manager",
	4: "Owner"
}
