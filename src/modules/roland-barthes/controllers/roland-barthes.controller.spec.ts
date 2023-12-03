import { Test, TestingModule } from '@nestjs/testing';
import { RolandBarthesController } from './roland-barthes.controller';
import { RolandBarthesService } from '../services/roland-barthes.service';
import { S3Service } from '../../../shared/services/s3.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { AskHimResponse } from '../models/roland-barthes.models';
import { AskHimDTO } from '../dto/ask-him.dto';
import { BadRequestException } from '@nestjs/common';

describe('RolandBarthesController', () => {
  let controller: RolandBarthesController;

  const rolandService = {
    askHim: jest.fn(),
  };
  const s3Service = {
    uploadFile: jest.fn(),
  };

  const logger = {
    error: jest.fn(),
    info: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolandBarthesController],
      providers: [
        {
          provide: RolandBarthesService,
          useValue: rolandService,
        },
        {
          provide: S3Service,
          useValue: s3Service,
        },
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: logger,
        },
      ],
    }).compile();

    controller = module.get<RolandBarthesController>(RolandBarthesController);
  });

  beforeEach(() => {
    rolandService.askHim.mockClear();
    s3Service.uploadFile.mockClear();
  });

  const data: AskHimDTO = {
    input: 'Test, 1, 2, 3...',
    name: 'Sohee',
  };
  const response: AskHimResponse = { output: 'It is me, Roland!' };

  describe('askRoland', () => {
    it('should call process input and save discourse to S3', async () => {
      rolandService.askHim.mockImplementationOnce((request) => {
        expect(request).toMatchObject(data);
        return response;
      });

      await controller.askRoland(data);

      expect(rolandService.askHim).toHaveBeenCalledTimes(1);
      expect(s3Service.uploadFile).toHaveBeenCalledTimes(1);
    });

    it('should propagate errors from RolandBarthesService', async () => {
      rolandService.askHim.mockImplementationOnce(() => {
        throw new BadRequestException();
      });

      await expect(controller.askRoland(data)).rejects.toThrow();

      expect(rolandService.askHim).toHaveBeenCalledTimes(1);
      expect(s3Service.uploadFile).not.toHaveBeenCalled();
    });
  });
});
