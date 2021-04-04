module.exports = (sequelize, DataTypes) => {
  return sequelize.define("user", {
    user: {
      type: DataTypes.STRING(12),
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    password: {
      type: DataTypes.STRING(24),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(12),
      allowNull: false,
    },
    birth: {
      type: DataTypes.STRING(8),
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING(1),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(11),
      allowNull: false,
      unique: true,
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
};