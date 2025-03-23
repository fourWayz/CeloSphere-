import {Celosphere} from "../typechain-types"
import { Contract, EventLog,Wallet } from 'ethers';
import {ethers} from "hardhat"
import { expect } from 'chai';
import { getContractFactory } from "@nomicfoundation/hardhat-ethers/types";


describe('Celosphere', function () {

  let socialMedia : Celosphere;
  let user1 : any;
  let user2 : any;
  let deployer : any

  before(async function() {
    [user1, user2,deployer] = await ethers.getSigners();

    const contractFactory = await ethers.getContractFactory("Celosphere");
    socialMedia = await contractFactory.deploy() as unknown as Celosphere

  })

  it('should register a user', async function () {
    const username = 'user1';

    await (socialMedia.connect(user1)).registerUser(username);
    const user = await socialMedia.users(user1.address);

    expect(user.username).to.equal(username);
    expect(user.userAddress).to.equal(user1.address);
    expect(user.isRegistered).to.be.true;
    
  });

  it('should create a post', async function () {
    const content = 'This is a test post';
    await (socialMedia.connect(user1)).createPost(content);
    const postsCount = await socialMedia.getPostsCount();
    expect(postsCount.toString()).to.equal('1');

    const post = await socialMedia.getPost(0);
    expect(post.author).to.equal(user1.address);
    expect(post.content).to.equal(content);
    expect(post.likes.toString()).to.equal('0');
    expect(post.commentsCount.toString()).to.equal('0');

  });
 
  
});