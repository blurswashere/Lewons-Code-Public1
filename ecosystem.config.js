module.exports = {
    apps: [
      {
        name: "Moderation",
        namespace: "Ramal",
        script: 'lewons.js',
        watch: false,
        exec_mode: "cluster",
        max_memory_restart: "1G",
        cwd: "./_BOTS/Jollity",
        output: '../../../Logger/[11]out.log',
        error: '../../../Logger/[12]error.log',
        log: '../../../Logger/[13]combined.outerr.log'
      },
    ]
  };