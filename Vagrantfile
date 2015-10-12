# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
  # For a complete reference, please see the online documentation at
  # https://docs.vagrantup.com.
  config.vm.box = "ubuntu/trusty64"

  config.vm.network "forwarded_port", guest: 3000, host: 3000
  config.vm.network "forwarded_port", guest: 4000, host: 4000

  config.vm.provider "virtualbox" do |vb|
    vb.memory = 2048
    vb.name = "Pancake_Project"
  end

  config.vm.provision "shell", path: "prereqs.sh", privileged: false
  config.vm.provision "shell", path: "autoDev.sh", privileged: false
end
